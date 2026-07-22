import { describe, expect, it } from 'vitest'
import { NodeTypes, parseForESLint } from '../src'
import { SourceCode } from '../src/tokenizer/sourceCode'
import { calculateTokenLocation, getLineInfo } from '../src/utils'
import type { ElementNode } from '../src/types'

describe('source locations', () => {
  it('handles every XML line-break form', () => {
    const source = 'a\r\nbc\rd\ne\u2028f\u2029g'
    const sourceCode = new SourceCode(source)

    expect(sourceCode.getLocationOf([3, source.length])).toStrictEqual({
      start: { line: 2, column: 0 },
      end: { line: 6, column: 1 },
    })
    expect(getLineInfo(source, 10)).toStrictEqual({ line: 5, column: 0 })
    expect(calculateTokenLocation(source, [6, 9])).toStrictEqual({
      start: { line: 3, column: 0 },
      end: { line: 4, column: 1 },
    })
  })

  it('does not eagerly materialize a wrapper for every source character', () => {
    const sourceCode = new SourceCode('abc')

    expect(sourceCode).not.toHaveProperty('charsList')
    expect(sourceCode.current()).toMatchObject({
      value: 'a',
      range: [0, 1],
    })

    sourceCode.next()

    expect(sourceCode.current()).toMatchObject({
      value: 'b',
      range: [1, 2],
    })
  })

  it('keeps locations accurate across a large multiline document', () => {
    const siblingCount = 5_000
    const siblings = Array.from(
      { length: siblingCount },
      (_, index) => `<g data-index="${index}" />`,
    ).join('\n')
    const source = `<svg>\n${siblings}\n</svg>`
    const { ast } = parseForESLint(source)
    const svg = ast.document.children[0] as ElementNode
    const elements = svg.children.filter(
      node => node.type === NodeTypes.Element,
    ) as ElementNode[]

    expect(elements).toHaveLength(siblingCount)
    expect(elements.at(-1)?.loc.start).toStrictEqual({
      line: siblingCount + 1,
      column: 0,
    })
    expect(ast.loc.end).toStrictEqual({
      line: siblingCount + 2,
      column: 6,
    })
  })
})
