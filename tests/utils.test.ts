import { describe, expect, it } from 'vitest'
import { cloneNode, cloneNodeWithParent } from '../src/ast/cloneNode'
import {
  findFirstNodeByType,
  findNodesByType,
} from '../src/ast/findNodesByType'
import {
  countNodes,
  filterNodes,
  getNodeDepth,
  getParentChain,
} from '../src/ast/nodeHelpers'
import { NodeTypes } from '../src/ast/nodeTypes'
import { traverseAST, walkAST } from '../src/ast/traverseAST'
import { isNodeType, validateNode } from '../src/ast/validateNode'
import { parseForESLint } from '../src/parser/parseForESLint'
import { unindent } from './helpers/unindent'

describe('ast utility functions', () => {
  const svgSource = unindent`
    <svg width="100" height="100">
      <circle cx="50" cy="50" r="40" />
      <rect x="10" y="10" width="30" height="30" />
    </svg>
  `

  const parsed = parseForESLint(svgSource)
  const ast = parsed.ast.document // Get the first document node

  describe('findNodesByType', () => {
    it('should find all nodes of a specific type', () => {
      const elements = findNodesByType(ast, NodeTypes.Element)
      expect(elements.length).toBeGreaterThan(0)
      expect(
        elements.every(node => node.type === NodeTypes.Element),
      ).toBeTruthy()
      expect(elements.map(element => element.name)).toStrictEqual([
        'svg',
        'circle',
        'rect',
      ])
    })

    it('should find text nodes', () => {
      const textNodes = findNodesByType(ast, NodeTypes.Text)
      expect(Array.isArray(textNodes)).toBeTruthy()
    })

    it('should find attribute key and value leaf nodes', () => {
      const keys = findNodesByType(ast, NodeTypes.AttributeKey)
      const values = findNodesByType(ast, NodeTypes.AttributeValue)

      expect(keys.map(node => ('value' in node ? node.value : ''))).toContain(
        'width',
      )
      expect(values.map(node => ('value' in node ? node.value : ''))).toContain(
        '100',
      )
    })

    it('should return empty array for non-existent types', () => {
      const comments = findNodesByType(ast, NodeTypes.Comment)
      expect(comments).toStrictEqual([])
    })
  })

  describe('findFirstNodeByType', () => {
    it('should find the first node of a specific type', () => {
      const firstTag = findFirstNodeByType(ast, NodeTypes.Element)
      expect(firstTag).toBeDefined()
      expect(firstTag?.type).toBe(NodeTypes.Element)
      expect(firstTag?.name).toBe('svg')
    })

    it('should return undefined for non-existent types', () => {
      const comment = findFirstNodeByType(ast, NodeTypes.Comment)
      expect(comment).toBeUndefined()
    })
  })

  describe('validateNode', () => {
    it('should validate correct nodes', () => {
      const elements = findNodesByType(ast, NodeTypes.Element)
      expect(validateNode(elements[0])).toBeTruthy()
    })

    it('should validate document node', () => {
      expect(validateNode(ast)).toBeTruthy()
    })

    it('should reject invalid nodes', () => {
      expect(validateNode({} as any)).toBeFalsy()
      expect(validateNode({ type: 'invalid' } as any)).toBeFalsy()
    })
  })

  describe('traverseAST', () => {
    it('should visit all nodes', () => {
      const visited: string[] = []

      traverseAST(ast, {
        enter(node) {
          visited.push(node.type)
        },
      })

      expect(visited.length).toBeGreaterThan(0)
      expect(visited[0]).toBe(NodeTypes.Document)
      expect(visited).toContain(NodeTypes.AttributeKey)
      expect(visited).toContain(NodeTypes.AttributeValue)
    })

    it('should call leave hook', () => {
      const entered: string[] = []
      const left: string[] = []

      traverseAST(ast, {
        enter(node) {
          entered.push(node.type)
        },
        leave(node) {
          left.push(node.type)
        },
      })

      expect(entered).toHaveLength(left.length)
    })

    it('should skip children when enter returns false', () => {
      const visited: string[] = []

      traverseAST(ast, {
        enter(node) {
          visited.push(node.type)
          // Skip children of Tag nodes
          if (node.type === NodeTypes.Element) {
            return false
          }
        },
      })

      expect(visited).toContain(NodeTypes.Document)
      expect(visited).toContain(NodeTypes.Element)
    })
  })

  describe('walkAST', () => {
    it('should walk through all nodes', () => {
      const types: string[] = []

      walkAST(ast, node => {
        types.push(node.type)
      })

      expect(types.length).toBeGreaterThan(0)
    })
  })

  describe('cloneNode', () => {
    it('should deep clone a node', () => {
      const elements = findNodesByType(ast, NodeTypes.Element)
      const original = elements[0]
      const cloned = cloneNode(original)

      expect(cloned).not.toBe(original)
      expect(cloned.type).toBe(original.type)
      expect(cloned.range).toStrictEqual(original.range)
      expect(cloned.range).not.toBe(original.range)
    })

    it('should remove parent references', () => {
      const elements = findNodesByType(ast, NodeTypes.Element)
      const cloned = cloneNode(elements[0])

      expect('parentRef' in cloned).toBeFalsy()
      expect('parent' in cloned).toBeFalsy()
    })
  })

  describe('isNodeType', () => {
    it('should check node type correctly', () => {
      const elements = findNodesByType(ast, NodeTypes.Element)
      expect(isNodeType(elements[0], NodeTypes.Element)).toBeTruthy()
      expect(isNodeType(elements[0], NodeTypes.Text)).toBeFalsy()
    })
  })

  describe('filterNodes', () => {
    it('should filter nodes by predicate', () => {
      const filtered = filterNodes(ast, node => node.type === NodeTypes.Element)

      expect(filtered.length).toBeGreaterThan(0)
      expect(
        filtered.every(node => node.type === NodeTypes.Element),
      ).toBeTruthy()
    })

    it('should handle complex predicates', () => {
      const filtered = filterNodes(
        ast,
        node =>
          node.type === NodeTypes.Element &&
          'name' in node &&
          node.name === 'circle',
      )

      expect(filtered).toHaveLength(1)
    })

    it('should filter attribute value leaf nodes', () => {
      const filtered = filterNodes(
        ast,
        node => node.type === NodeTypes.AttributeValue,
      )

      expect(filtered.length).toBeGreaterThan(0)
    })
  })

  describe('countNodes', () => {
    it('should count all nodes in AST', () => {
      const count = countNodes(ast)
      const visited: string[] = []

      traverseAST(ast, {
        enter(node) {
          visited.push(node.type)
        },
      })

      expect(count).toBe(visited.length)
    })

    it('should count single node', () => {
      const textNodes = findNodesByType(ast, NodeTypes.Text)
      expect(textNodes.length).toBeGreaterThan(0)
      const count = countNodes(textNodes[0])
      expect(count).toBe(1)
    })
  })

  describe('getNodeDepth', () => {
    it('should return 0 for root node', () => {
      expect(getNodeDepth(ast)).toBe(0)
    })

    it('should calculate depth for nested nodes', () => {
      // Clone with parent references first
      const astWithParents = cloneNodeWithParent(ast)
      const elements = findNodesByType(astWithParents, NodeTypes.Element)
      const depths = elements.map(element => getNodeDepth(element))
      expect(depths.some(d => d > 0)).toBeTruthy()
    })
  })

  describe('getParentChain', () => {
    it('should return empty array for root', () => {
      const chain = getParentChain(ast)
      expect(chain).toStrictEqual([])
    })

    it('should return parent chain for nested nodes', () => {
      const document = cloneNodeWithParent(
        parseForESLint('<svg><g><path /></g></svg>').ast.document,
      )
      const [svg, group, path] = findNodesByType(document, NodeTypes.Element)
      const chain = getParentChain(path)
      expect(chain).toHaveLength(3)
      expect(chain[0]).toBe(group)
      expect(chain[1]).toBe(svg)
      expect(chain[2]).toBe(document)
      expect(getNodeDepth(path)).toBe(3)
    })

    it('follows ESLint parent links through the document to the program', () => {
      const program = parseForESLint('<svg><g><path /></g></svg>').ast
      walkAST(program, (node, parent) => Reflect.set(node, 'parent', parent))
      const [svg, group, path] = findNodesByType(program, NodeTypes.Element)
      const chain = getParentChain(path)
      expect(chain).toHaveLength(4)
      expect(chain[0]).toBe(group)
      expect(chain[1]).toBe(svg)
      expect(chain[2]).toBe(program.document)
      expect(chain[3]).toBe(program)
      expect(getParentChain(program)).toEqual([])
    })
  })
})
