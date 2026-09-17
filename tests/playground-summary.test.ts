import { describe, expect, it } from 'vitest'
import { summarizeDocument } from '../docs/.vitepress/utils/summarizeDocument'
import { parseForESLint } from '../src'

describe('playground document summary', () => {
  it('counts document nodes without duplicating ESLint comments or tokens', () => {
    const { ast } = parseForESLint(
      '<svg width="10"><!-- note --><g><path/></g><circle/></svg>',
    )
    const summary = summarizeDocument(ast)

    expect(summary).toMatchObject({
      nodes: 9,
      attributes: 1,
      comments: 1,
      maxDepth: 3,
      rootAttributes: [{ name: 'width', value: '10' }],
    })
    expect(
      summary.elements.map(({ node, depth }) => [node.name, depth]),
    ).toEqual([
      ['svg', 0],
      ['g', 1],
      ['path', 2],
      ['circle', 1],
    ])
    expect(summary.elements[2].node.range).toEqual([32, 39])
  })

  it('returns no stale statistics when a parse result is unavailable', () => {
    expect(summarizeDocument()).toEqual({
      nodes: 0,
      attributes: 0,
      comments: 0,
      maxDepth: 0,
      elements: [],
      rootAttributes: [],
    })
  })

  it('summarizes recovered elements and keeps duplicate attributes inspectable', () => {
    const result = parseForESLint('<svg width="1" width="2"><g></svg>', {
      errorRecovery: true,
    })
    const summary = summarizeDocument(result.ast)

    expect(result.services.errors.length).toBeGreaterThan(0)
    expect(summary.elements.map(({ node }) => node.name)).toEqual(['svg', 'g'])
    expect(summary.rootAttributes).toEqual([
      { name: 'width', value: '1' },
      { name: 'width', value: '2' },
    ])
  })

  it('handles deeply nested documents without recursive summary traversal', () => {
    const source = `<svg>${'<g>'.repeat(2000)}<path/>${'</g>'.repeat(2000)}</svg>`
    const summary = summarizeDocument(parseForESLint(source).ast)

    expect(summary.elements).toHaveLength(2002)
    expect(summary.maxDepth).toBe(2002)
  })
})
