import { describe, expect, it } from 'vitest'
import {
  findNodeByType,
  NodeTypes,
  ParseError,
  ParseErrorType,
  parseForESLint,
  traverseAST,
} from '../../src'

describe('XML boundary regressions', () => {
  it.each([
    '<!DOCTYPE svg[]>',
    '<!DOCTYPE svg[<!ELEMENT svg EMPTY>]>',
    '<!DOCTYPE svg SYSTEM "svg.dtd"[]>',
    '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "svg.dtd"[]>',
    "<!DOCTYPE svg SYSTEM ''>",
    '<!DOCTYPE svg PUBLIC "" "">',
  ])('accepts complete doctype syntax: %s', declaration => {
    const source = `${declaration}<svg/>`
    const result = parseForESLint(source)

    expect(result.services.errors).toEqual([])
    expect(result.ast.document.children[0]).toMatchObject({
      type: NodeTypes.Doctype,
      range: [0, declaration.length],
    })
    const doctype = result.ast.document.children[0]
    expect.assert(doctype.type === NodeTypes.Doctype)
    expect(doctype.attributes[0].value?.value).toBe('svg')
    expect(doctype.internalSubset).toBe(
      declaration.includes('[')
        ? declaration.slice(declaration.indexOf('[') + 1, -2)
        : undefined,
    )
  })

  it.each([
    '<!DOCTYPE "svg">',
    '<!DOCTYPE svg SYSTEM>',
    '<!DOCTYPE svg garbage>',
    '<!DOCTYPE svg PUBLIC "id">',
    '<!DOCTYPE svg SYSTEM svg.dtd>',
    '<!DOCTYPE svg SYSTEM "svg.dtd" "extra">',
    '<!DOCTYPE svg "SYSTEM" "svg.dtd">',
    '<!DOCTYPE svg PUBLIC "id""svg.dtd">',
    '<!DOCTYPE svg PUBLIC "invalid\tid" "svg.dtd">',
    '<!doctype svg>',
    '<!DOCTYPEsvg svg>',
  ])('rejects malformed outer doctype syntax: %s', declaration => {
    const source = `${declaration}<svg/>`
    expect(() => parseForESLint(source)).toThrow(ParseError)

    const result = parseForESLint(source, { errorRecovery: true })
    expect(result.services.errors).toContainEqual(
      expect.objectContaining({ type: ParseErrorType.InvalidDoctype }),
    )
    expect(result.ast.document.children[0].type).toBe(NodeTypes.Doctype)
  })

  it.each(['<? p?>', '<?\tp data?>', '<?p\u{A0}data?>'])(
    'rejects invalid processing-instruction boundaries: %s',
    instruction => {
      const source = `<svg>${instruction}</svg>`
      expect(() => parseForESLint(source)).toThrow(ParseError)
      const result = parseForESLint(source, { errorRecovery: true })
      expect(result.services.errors).toContainEqual(
        expect.objectContaining({
          type: ParseErrorType.InvalidProcessingInstruction,
          range: [5, source.length - 6],
        }),
      )
    },
  )

  it('preserves non-XML whitespace in valid PI targets and data', () => {
    const result = parseForESLint(
      '<svg><?p\u{1680} \t\u{A0}data\u{A0}\n?></svg>',
    )
    expect(result.ast.document.children[0]).toMatchObject({
      children: [{ target: 'p\u{1680}', value: '\u{A0}data\u{A0}' }],
    })
    expect(result.services.errors).toEqual([])
  })

  it.each(['\u{A0}', '\u{1680}', '\u{2003}', '\u{2028}', '\u{2029}'])(
    'rejects non-XML whitespace outside the root: %j',
    whitespace => {
      for (const source of [`${whitespace}<svg/>`, `<svg/>${whitespace}`]) {
        expect(() => parseForESLint(source)).toThrow(ParseError)
        expect(
          parseForESLint(source, { errorRecovery: true }).services.errors,
        ).toContainEqual(
          expect.objectContaining({ type: ParseErrorType.InvalidDocument }),
        )
      }
    },
  )

  it('accepts XML whitespace outside the root', () => {
    expect(parseForESLint(' \t\r\n<svg/>\r\n\t ').services.errors).toEqual([])
  })

  it.each([
    '<svg><g>hi',
    '<svg>\n<g><path/>\n</svg>',
    '<svg><g><path></svg>',
    '<svg title="unfinished',
    '<svg><!-- unfinished',
  ])('keeps recovered ranges around all descendants: %s', source => {
    const result = parseForESLint(source, { errorRecovery: true })
    const ancestorClose = result.ast.tokens.find(
      token => token.value === '</svg>',
    )
    const childBounds: { child: number[]; parent: number[] }[] = []
    traverseAST(result.ast.document, {
      enter(node, parent) {
        if (parent) {
          childBounds.push({ child: node.range, parent: parent.range })
        }
      },
    })
    for (const { child, parent } of childBounds) {
      expect(child[0]).toBeGreaterThanOrEqual(parent[0])
      expect(child[1]).toBeLessThanOrEqual(parent[1])
    }
    const elements = findNodeByType(
      result.ast.document,
      NodeTypes.Element,
    ).filter(node => !node.selfClosing)
    for (const node of elements) {
      expect(node.range[1]).toBe(
        node.name === 'svg'
          ? source.length
          : (ancestorClose?.range[0] ?? source.length),
      )
      expect(node.loc.end).toEqual(
        node.name === 'svg'
          ? result.ast.loc.end
          : (ancestorClose?.loc.start ?? result.ast.loc.end),
      )
    }
  })

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
