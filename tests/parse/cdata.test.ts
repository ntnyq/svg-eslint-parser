import { describe, expect, it } from 'vitest'
import { NodeTypes, ParseErrorType, parseForESLint } from '../../src'
import type { CDATANode, ElementNode } from '../../src/types'

describe('CDATA parsing', () => {
  it('keeps markup-looking content in a CDATA node', () => {
    const source = '<svg><![CDATA[<circle/> & text]]></svg>'
    const { ast } = parseForESLint(source)
    const svg = ast.document.children[0] as ElementNode
    const cdata = svg.children[0] as CDATANode

    expect(svg.children).toHaveLength(1)
    expect(cdata).toMatchObject({
      type: NodeTypes.CDATA,
      value: '<circle/> & text',
      range: [5, 33],
    })
  })

  it('tracks multiline CDATA locations', () => {
    const source = '<svg><![CDATA[line 1\nline 2]]></svg>'
    const { ast } = parseForESLint(source)
    const svg = ast.document.children[0] as ElementNode
    const cdata = svg.children[0] as CDATANode

    expect(cdata.loc).toStrictEqual({
      start: { line: 1, column: 5 },
      end: { line: 2, column: 9 },
    })
  })

  it('recovers unterminated CDATA content with a diagnostic', () => {
    const source = '<svg><![CDATA[<circle/>'
    const result = parseForESLint(source, { errorRecovery: true })
    const svg = result.ast.document.children[0] as ElementNode
    const cdata = svg.children[0] as CDATANode

    expect(cdata).toMatchObject({
      type: NodeTypes.CDATA,
      value: '<circle/>',
      range: [5, source.length],
    })
    expect(result.services.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: ParseErrorType.MalformedCDATA,
          range: [5, source.length],
        }),
      ]),
    )
  })
})
