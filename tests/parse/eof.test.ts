import { describe, expect, it } from 'vitest'
import { NodeTypes, ParseErrorType } from '../../src'
import { parse } from '../../src/parser'
import type {
  CommentNode,
  DoctypeNode,
  ElementNode,
  TextNode,
  XMLDeclarationNode,
} from '../../src/types'

describe('unexpected end of input', () => {
  it('keeps an incomplete opening tag in the AST', () => {
    const source = '<svg'
    const result = parse(source)
    const element = result.ast.children[0] as ElementNode

    expect(element).toMatchObject({
      type: NodeTypes.Element,
      name: 'svg',
      range: [0, source.length],
    })
    expect(result.ast.range).toStrictEqual([0, source.length])
    expect(result.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ type: ParseErrorType.UnexpectedToken }),
        expect.objectContaining({ type: ParseErrorType.UnclosedTag }),
      ]),
    )
  })

  it('keeps an incomplete closing tag as text', () => {
    const source = '</svg'
    const result = parse(source)
    const text = result.ast.children[0] as TextNode

    expect(text).toMatchObject({
      type: NodeTypes.Text,
      value: source,
      range: [0, source.length],
    })
    expect(result.errors).toEqual([
      expect.objectContaining({ type: ParseErrorType.UnexpectedToken }),
    ])
  })

  it('keeps unterminated comment content and reports it', () => {
    const source = '<!-- unterminated'
    const result = parse(source)
    const comment = result.ast.children[0] as CommentNode

    expect(comment).toMatchObject({
      type: NodeTypes.Comment,
      content: ' unterminated',
      value: ' unterminated',
      range: [0, source.length],
    })
    expect(result.errors).toEqual([
      expect.objectContaining({
        type: ParseErrorType.MalformedComment,
        range: [0, source.length],
      }),
    ])
  })

  it('keeps an unterminated attribute value and reports its quote', () => {
    const source = '<svg title="unterminated'
    const result = parse(source)
    const element = result.ast.children[0] as ElementNode

    expect(element.attributes[0].value?.value).toBe('unterminated')
    expect(result.ast.range).toStrictEqual([0, source.length])
    expect(result.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: ParseErrorType.UnmatchedQuote,
          range: [11, source.length],
        }),
      ]),
    )
  })

  it('reports an attribute assignment without a value', () => {
    const source = '<svg title='
    const result = parse(source)
    const element = result.ast.children[0] as ElementNode

    expect(element.attributes[0].key.value).toBe('title')
    expect(element.attributes[0].value).toBeUndefined()
    expect(result.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: ParseErrorType.InvalidAttribute,
          range: [source.length, source.length],
        }),
      ]),
    )
  })

  it('reports an XML declaration without its closing delimiter', () => {
    const source = '<?xml version="1.0"'
    const result = parse(source)
    const declaration = result.ast.children[0] as XMLDeclarationNode

    expect(declaration.attributes[0].value?.value).toBe('1.0')
    expect(result.ast.range).toStrictEqual([0, source.length])
    expect(result.errors).toEqual([
      expect.objectContaining({
        type: ParseErrorType.InvalidXMLDeclaration,
        range: [0, source.length],
      }),
    ])
  })

  it('keeps an unterminated doctype value and reports its quote', () => {
    const source = '<!DOCTYPE svg PUBLIC "unterminated'
    const result = parse(source)
    const doctype = result.ast.children[0] as DoctypeNode

    expect(doctype.attributes.at(-1)?.value?.value).toBe('unterminated')
    expect(result.errors).toEqual([
      expect.objectContaining({
        type: ParseErrorType.UnmatchedQuote,
        range: [21, source.length],
      }),
    ])
  })
})
