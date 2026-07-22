import { describe, expect, it } from 'vitest'
import { NodeTypes, ParseErrorType, parseForESLint } from '../../src'
import type { ElementNode, ProcessingInstructionNode } from '../../src/types'

describe('processing instruction parsing', () => {
  it('parses an xml-stylesheet instruction before the root element', () => {
    const source = '<?xml-stylesheet href="style.css" type="text/css"?><svg />'
    const { ast } = parseForESLint(source)
    const instruction = ast.document.children[0] as ProcessingInstructionNode

    expect(instruction).toMatchObject({
      type: NodeTypes.ProcessingInstruction,
      target: 'xml-stylesheet',
      value: 'href="style.css" type="text/css"',
      range: [0, source.indexOf('<svg')],
    })
    expect(ast.document.children[1]).toMatchObject({
      type: NodeTypes.Element,
      name: 'svg',
    })
  })

  it('keeps markup-looking instruction content out of the element tree', () => {
    const source = '<svg><?render <circle/>?></svg>'
    const { ast } = parseForESLint(source)
    const svg = ast.document.children[0] as ElementNode

    expect(svg.children).toEqual([
      expect.objectContaining({
        type: NodeTypes.ProcessingInstruction,
        target: 'render',
        value: '<circle/>',
      }),
    ])
  })

  it('recovers an unterminated processing instruction', () => {
    const source = '<svg><?render value'
    const result = parseForESLint(source, { errorRecovery: true })
    const svg = result.ast.document.children[0] as ElementNode

    expect(svg.children[0]).toMatchObject({
      type: NodeTypes.ProcessingInstruction,
      target: 'render',
      value: 'value',
      range: [5, source.length],
    })
    expect(result.services.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: ParseErrorType.InvalidProcessingInstruction,
          range: [5, source.length],
        }),
      ]),
    )
  })
})
