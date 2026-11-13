import { describe, expect, expectTypeOf, it } from 'vitest'
import {
  cloneNode,
  cloneNodeWithParent,
  findFirstNodeByType,
  getParentChain,
  mapNodes,
  NodeTypes,
  parse,
  parseForESLint,
  walkAST,
} from '../src'
import type { AnyNode } from '../src'

describe('AST mapping', () => {
  it('visits only AST children in the same order as traversal', () => {
    const program = parseForESLint('<!-- comment --><svg a="1"><g/></svg>').ast
    const expected: AnyNode[] = []
    const visited: AnyNode[] = []
    walkAST(program, node => expected.push(node))

    const mapped = mapNodes(program, node => {
      visited.push(node)
      return node
    })

    expect(mapped).toBe(program)
    expect(visited).toEqual(expected)
    expect(program.tokens).toHaveLength(10)
    expect(program.comments).toHaveLength(1)
  })

  it('maps replacement children in preorder and updates their owning slots', () => {
    const document = parse('<svg a="1"><g/></svg>')
    const visited: string[] = []
    const mapped = mapNodes(document, node => {
      visited.push(node.type)
      if (node.type === NodeTypes.Element && node.name === 'g') {
        return {
          ...node,
          name: 'path',
        }
      }
      if (node.type === NodeTypes.AttributeKey) {
        return {
          ...node,
          value: 'b',
        }
      }
      return node
    })

    expect(mapped).toBe(document)
    expect(document.children[0]).toMatchObject({
      attributes: [{ key: { value: 'b' } }],
      children: [{ name: 'path' }],
    })
    expect(visited).toEqual([
      'Document',
      'Element',
      'Attribute',
      'AttributeKey',
      'AttributeValue',
      'Element',
    ])
  })

  it('does not follow parent links', () => {
    const document = cloneNodeWithParent(parse('<svg><g/></svg>'))
    let visited = 0
    const mapped = mapNodes(document, node => {
      visited++
      return node
    })
    expect(mapped).toBe(document)
    expect(visited).toBe(3)
  })

  it('maps descendants introduced by replacement nodes', () => {
    const document = parse('<svg><g/></svg>')
    const replacement = parse('<path>new</path>').children[0]
    const mapped = mapNodes(document, node => {
      if (node.type === NodeTypes.Element && node.name === 'g') {
        return replacement
      }
      if (node.type === NodeTypes.Text) {
        return {
          ...node,
          value: node.value.toUpperCase(),
        }
      }
      return node
    })
    expect(mapped).toMatchObject({
      children: [
        { children: [{ name: 'path', children: [{ value: 'NEW' }] }] },
      ],
    })
  })

  it('returns the actual replacement root type', () => {
    const text = {
      type: NodeTypes.Text,
      value: 'replacement',
      range: [0, 0],
      loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 0 } },
    } satisfies AnyNode
    const mapped = mapNodes(parse('<svg/>'), () => text)
    expect(mapped).toBe(text)
    expectTypeOf(mapped).toEqualTypeOf<AnyNode>()
  })
})

describe('AST cloning', () => {
  it('rebuilds only AST parent links, leaving metadata and tokens as plain data', () => {
    const original = parseForESLint('<!-- comment --><svg a="1"><g/></svg>').ast
    const cloned = cloneNodeWithParent(original)

    walkAST(cloned, (node, parent) => {
      expect(getParentChain(node)[0]).toBe(parent ?? undefined)
      expect('parentRef' in node.loc).toBe(false)
      expect('parentRef' in node.loc.start).toBe(false)
      expect('parentRef' in node.loc.end).toBe(false)
      expect('parentRef' in node.range).toBe(false)
      expect(() => JSON.stringify(node.loc)).not.toThrow()
    })
    expect(cloned.tokens.every(token => !('parentRef' in token))).toBe(true)
    expect(cloned.comments.every(comment => !('parentRef' in comment))).toBe(
      true,
    )
    expect(cloned.tokens).toEqual(original.tokens)
    expect(cloned.tokens).not.toBe(original.tokens)
    const plain = cloneNode(cloned)
    expect(plain).toEqual(original)
    expect(() => JSON.stringify(plain)).not.toThrow()
    walkAST(original, node => expect('parentRef' in node).toBe(false))
  })

  it('replaces existing parent links and accepts an explicit root parent', () => {
    const externalParent = parse('<external/>')
    const original = cloneNodeWithParent(parse('<svg><g/></svg>'))
    const cloned = cloneNodeWithParent(original, externalParent)
    const child = findFirstNodeByType(cloned, NodeTypes.Element)
    expect.assert(child)
    expect(getParentChain(child)).toEqual([cloned, externalParent])
    expect(getParentChain(child)[0]).not.toBe(original)
  })

  it('removes ESLint parent links without changing the input', () => {
    const original = parseForESLint('<svg a="1"/>').ast
    walkAST(original, (node, parent) => Reflect.set(node, 'parent', parent))
    const plain = cloneNode(original)
    const withParents = cloneNodeWithParent(original)
    walkAST(plain, node => {
      expect('parent' in node).toBe(false)
      expect('parentRef' in node).toBe(false)
    })
    walkAST(withParents, (node, parent) => {
      expect('parent' in node).toBe(false)
      expect(getParentChain(node)[0]).toBe(parent ?? undefined)
    })
    expect(Reflect.get(original.document, 'parent')).toBe(original)
  })
})
