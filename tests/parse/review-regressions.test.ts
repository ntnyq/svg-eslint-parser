import { describe, expect, it } from 'vitest'
import {
  NodeTypes,
  ParseError,
  ParseErrorType,
  parseForESLint,
} from '../../src'

describe('XML boundary regressions', () => {
  it.each(['<!--', '<svg><!--'])(
    'recovers an empty unfinished comment: %j',
    source => {
      const result = parseForESLint(source, { errorRecovery: true })

      expect(result.ast.comments).toEqual([
        expect.objectContaining({
          value: '',
          range: [source.indexOf('<!--'), source.length],
        }),
      ])
      expect(result.services.errors).toContainEqual(
        expect.objectContaining({
          type: ParseErrorType.MalformedComment,
          range: [source.indexOf('<!--'), source.length],
        }),
      )
      expect(() => parseForESLint(source)).toThrow(ParseError)
    },
  )

  it.each([
    'é',
    '图形',
    '\u{1680}name',
    ':svg',
    '\u{200C}name',
    '\u{3001}',
    '\u{10000}',
    '\u{EFFFF}',
    'a\u{301}',
    'a\u{B7}',
  ])('recognizes XML element names: %s', name => {
    const source = `<${name} ${name}="ok"><${name}/></${name}\r>`
    const result = parseForESLint(source)
    const root = result.ast.document.children[0]
    expect(result.services.errors).toEqual([])
    expect(root).toMatchObject({
      type: NodeTypes.Element,
      name,
      range: [0, source.length],
      children: [expect.objectContaining({ type: NodeTypes.Element, name })],
    })
  })

  it.each(['\u{37E}', '\u{F0000}', '\u{301}'])(
    'rejects characters outside XML NameStartChar: %s',
    name => {
      expect(() => parseForESLint(`<svg><${name}/></svg>`)).toThrow(ParseError)
    },
  )

  it.each(['', 'x]', 'x]]', 'x]]]]', 'x]a]', '\n内容]'])(
    'preserves CDATA content and delimiter ranges: %j',
    content => {
      const source = `<svg><![CDATA[${content}]]></svg>`
      const result = parseForESLint(source)
      const root = result.ast.document.children[0]
      expect(root).toMatchObject({
        children: [
          expect.objectContaining({
            type: NodeTypes.CDATA,
            value: content,
            range: [5, source.length - 6],
          }),
        ],
      })
      const close = result.ast.tokens.find(token => token.type === 'CDATAClose')
      expect(close?.range).toEqual([source.length - 9, source.length - 6])
      expect(result.services.errors).toEqual([])
    },
  )

  it.each(['x?', 'x??', 'x????', 'x?a?', '\n内容?'])(
    'preserves overlapping PI endings: %j',
    content => {
      const source = `<svg><?p ${content}?></svg>`
      expect(parseForESLint(source).ast.document.children[0]).toMatchObject({
        children: [
          expect.objectContaining({
            type: NodeTypes.ProcessingInstruction,
            target: 'p',
            value: content.trim(),
            range: [5, source.length - 6],
          }),
        ],
      })
    },
  )

  it.each([
    ['<!ELEMENT svg EMPTY>', ' '],
    ['<!-- ]> " -->', '\t\r\n '],
    ['<?p ]> " ??>', ''],
    ['<!-- ]> --><!-- ]> --><?p ]>?>', '\r'],
    ['<!ENTITY marker "]>">', '\n'],
  ])('keeps the complete internal subset: %j', (content, whitespace) => {
    const source = `<!DOCTYPE svg [${content}]${whitespace}><svg/>`
    const result = parseForESLint(source)
    expect(result.services.errors).toEqual([])
    expect(result.ast.document.children[0]).toMatchObject({
      type: NodeTypes.Doctype,
      internalSubset: content,
      range: [0, source.indexOf('<svg/>')],
    })
    const subset = result.ast.tokens.find(
      token => token.type === 'DoctypeInternalSubset',
    )
    expect(subset?.range).toEqual([14, 16 + content.length])
    expect(source.slice(...subset!.range)).toBe(`[${content}]`)
  })

  it.each(['\r', '\n', '\r\n', ' \t\r\n'])(
    'accepts closing-tag XML whitespace: %j',
    whitespace => {
      const source = `<svg></svg${whitespace}>`
      for (const errorRecovery of [false, true]) {
        const result = parseForESLint(source, { errorRecovery })
        expect(result.services.errors).toEqual([])
        expect(result.ast.document.children[0].range).toEqual([
          0,
          source.length,
        ])
      }
    },
  )

  it.each([
    ['<svg a="1"b="2"/>', ParseErrorType.InvalidAttribute],
    ["<svg a='1'b='2'/>", ParseErrorType.InvalidAttribute],
    [
      '<?xml version="1.0"encoding="UTF-8"?><svg/>',
      ParseErrorType.InvalidXMLDeclaration,
    ],
    ['<svg /junk></svg>', ParseErrorType.UnexpectedToken],
    ['<svg / ></svg>', ParseErrorType.UnexpectedToken],
    ['<svg></ svg>', ParseErrorType.InvalidCharacter],
    ['<svg>1 < 2</svg>', ParseErrorType.InvalidCharacter],
    ['<svg>]]></svg>', ParseErrorType.InvalidCharacter],
    ['<svg>\0</svg>', ParseErrorType.InvalidCharacter],
    ['<svg>\u{D800}</svg>', ParseErrorType.InvalidCharacter],
    ['<svg>\u{FFFF}</svg>', ParseErrorType.InvalidCharacter],
    ['<svg a="\0"/>', ParseErrorType.InvalidCharacter],
    ['<!DOCTYPE svg []junk><svg/>', ParseErrorType.InvalidDoctype],
  ])('reports malformed XML in both modes: %j', (source, type) => {
    expect(() => parseForESLint(source)).toThrow(ParseError)
    const result = parseForESLint(source, { errorRecovery: true })
    expect(result.services.errors).toContainEqual(
      expect.objectContaining({ type }),
    )
    expect(result.ast.document.range).toEqual([0, source.length])
  })

  it('keeps adjacent attributes and invalid text in recovery mode', () => {
    const result = parseForESLint('<svg a="1"b="2">1 < 2\0]]></svg>', {
      errorRecovery: true,
    })
    expect(result.ast.document.children[0]).toMatchObject({
      attributes: [
        { key: { value: 'a' }, value: { value: '1' } },
        { key: { value: 'b' }, value: { value: '2' } },
      ],
      children: [{ type: NodeTypes.Text, value: '1 < 2\0]]>' }],
    })
  })

  it('accepts escaped text, supplementary characters, and all XML separators', () => {
    expect(
      parseForESLint('<svg a="1"\r\n\tb="2">&lt; &amp; ]]&gt; 😀\r\n\t</svg>')
        .services.errors,
    ).toEqual([])
  })
})
