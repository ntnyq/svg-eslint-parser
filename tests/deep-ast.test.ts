import { describe, expect, it } from 'vitest'
import { NodeTypes, parseForESLint } from '../src'
import { cloneNode, cloneNodeWithParent } from '../src/ast/cloneNode'
import { findFirstNodeByType, findNodeByType } from '../src/ast/findNodesByType'
import {
  countNodes,
  filterNodes,
  getNodeDepth,
  mapNodes,
} from '../src/ast/nodeHelpers'
import { traverseAST, walkAST } from '../src/ast/traverseAST'

describe('deep AST traversal', () => {
  it.each([
    ['cloneNode', cloneNode],
    ['cloneNodeWithParent', cloneNodeWithParent],
    [
      'mapNodes',
      (node: Parameters<typeof mapNodes>[0]) =>
        mapNodes(node, current => current),
    ],
  ] as const)('handles 6000 nested elements with %s', (_name, transform) => {
    const depth = 6_000
    const document = parseForESLint(
      `<svg>${'<g>'.repeat(depth)}<path/>${'</g>'.repeat(depth)}</svg>`,
    ).ast.document
    const transformed = transform(document)
    const elements = findNodeByType(transformed, NodeTypes.Element)
    expect(elements).toHaveLength(depth + 2)
    const deepest = elements.at(-1)
    expect.assert(deepest)
    expect(deepest.name).toBe('path')
    expect(getNodeDepth(deepest)).toBe(
      _name === 'cloneNodeWithParent' ? depth + 2 : 0,
    )
  })

  it('parses and traverses a wide document without argument stack overflow', () => {
    const childCount = 130_000
    const source = `<svg>${'<g/>'.repeat(childCount)}</svg>`
    const result = parseForESLint(source)
    expect(result.services.errors).toEqual([])
    const elements = findNodeByType(result.ast.document, NodeTypes.Element)
    expect(elements).toHaveLength(childCount + 1)
    expect(elements[1].range).toEqual([5, 9])
    expect(elements.at(-1)?.range).toEqual([
      source.length - 10,
      source.length - 6,
    ])
    expect(elements.every(node => !('parentRef' in node))).toBe(true)
    expect(countNodes(result.ast.document)).toBe(childCount + 2)
  })

  it('parses and traverses deeply nested SVG without overflowing the stack', () => {
    const depth = 6_000
    const source = `<svg>${'<g>'.repeat(depth)}<!-- deepest -->${'</g>'.repeat(depth)}</svg>`
    const { ast } = parseForESLint(source)
    const document = ast.document
    let entered = 0
    let left = 0
    let walked = 0

    traverseAST(document, {
      enter() {
        entered++
      },
      leave() {
        left++
      },
    })
    walkAST(document, () => {
      walked++
    })

    expect(ast.comments).toHaveLength(1)
    expect(entered).toBe(left)
    expect(walked).toBe(entered)
    expect(countNodes(document)).toBe(entered)
    expect(findNodeByType(document, NodeTypes.Element)).toHaveLength(depth + 1)
    expect(findFirstNodeByType(document, NodeTypes.Comment)).toMatchObject({
      type: NodeTypes.Comment,
      content: ' deepest ',
    })
    expect(
      filterNodes(document, node => node.type === NodeTypes.Comment),
    ).toHaveLength(1)
  })

  it('preserves enter, skip, and leave ordering', () => {
    const { ast } = parseForESLint('<svg><g><path /></g><rect /></svg>')
    const events: string[] = []

    traverseAST(ast.document, {
      enter(node) {
        if (node.type === NodeTypes.Element) {
          events.push(`enter:${node.name}`)
          return node.name !== 'g'
        }
      },
      leave(node) {
        if (node.type === NodeTypes.Element) {
          events.push(`leave:${node.name}`)
        }
      },
    })

    expect(events).toStrictEqual([
      'enter:svg',
      'enter:g',
      'leave:g',
      'enter:rect',
      'leave:rect',
      'leave:svg',
    ])
  })
})
