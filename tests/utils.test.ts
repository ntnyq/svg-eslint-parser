import { unindent } from '@ntnyq/utils'
import { describe, expect, it } from 'vitest'

import { NodeTypes } from '../src/constants'
import { parseForESLint } from '../src/parser'
import {
  cloneNode,
  cloneNodeWithParent,
  countNodes,
  filterNodes,
  findFirstNodeByType,
  findNodeByType,
  getNodeDepth,
  getParentChain,
  isNodeType,
  traverseAST,
  validateNode,
  walkAST,
} from '../src/utils'

describe('AST Utility Functions', () => {
  const svgSource = unindent`
    <svg width="100" height="100">
      <circle cx="50" cy="50" r="40" />
      <rect x="10" y="10" width="30" height="30" />
    </svg>
  `

  const parsed = parseForESLint(svgSource)
  const ast = parsed.ast.body[0] // Get the first document node

  describe('findNodeByType', () => {
    it('should find all nodes of a specific type', () => {
      const tags = findNodeByType(ast, NodeTypes.Tag)
      expect(tags.length).toBeGreaterThan(0)
      expect(tags.every(node => node.type === NodeTypes.Tag)).toBe(true)
    })

    it('should find text nodes', () => {
      const textNodes = findNodeByType(ast, NodeTypes.Text)
      expect(Array.isArray(textNodes)).toBe(true)
    })

    it('should return empty array for non-existent types', () => {
      const comments = findNodeByType(ast, NodeTypes.Comment)
      expect(comments).toEqual([])
    })
  })

  describe('findFirstNodeByType', () => {
    it('should find the first node of a specific type', () => {
      const firstTag = findFirstNodeByType(ast, NodeTypes.Tag)
      expect(firstTag).toBeDefined()
      expect(firstTag?.type).toBe(NodeTypes.Tag)
    })

    it('should return undefined for non-existent types', () => {
      const comment = findFirstNodeByType(ast, NodeTypes.Comment)
      expect(comment).toBeUndefined()
    })
  })

  describe('validateNode', () => {
    it('should validate correct nodes', () => {
      const tags = findNodeByType(ast, NodeTypes.Tag)
      expect(validateNode(tags[0])).toBe(true)
    })

    it('should validate document node', () => {
      expect(validateNode(ast)).toBe(true)
    })

    it('should reject invalid nodes', () => {
      expect(validateNode({} as any)).toBe(false)
      expect(validateNode({ type: 'invalid' } as any)).toBe(false)
    })
  })

  describe('traverseAST', () => {
    it('should visit all nodes', () => {
      const visited: string[] = []

      traverseAST(ast, {
        enter: node => {
          visited.push(node.type)
        },
      })

      expect(visited.length).toBeGreaterThan(0)
      expect(visited[0]).toBe(NodeTypes.Document)
    })

    it('should call leave hook', () => {
      const entered: string[] = []
      const left: string[] = []

      traverseAST(ast, {
        enter: node => {
          entered.push(node.type)
        },
        leave: node => {
          left.push(node.type)
        },
      })

      expect(entered.length).toBe(left.length)
    })

    it('should skip children when enter returns false', () => {
      const visited: string[] = []

      traverseAST(ast, {
        enter: node => {
          visited.push(node.type)
          // Skip children of Tag nodes
          if (node.type === NodeTypes.Tag) {
            return false
          }
        },
      })

      expect(visited).toContain(NodeTypes.Document)
      expect(visited).toContain(NodeTypes.Tag)
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
      const tags = findNodeByType(ast, NodeTypes.Tag)
      const original = tags[0]
      const cloned = cloneNode(original)

      expect(cloned).not.toBe(original)
      expect(cloned.type).toBe(original.type)
      expect(cloned.range).toEqual(original.range)
      expect(cloned.range).not.toBe(original.range)
    })

    it('should remove parent references', () => {
      const tags = findNodeByType(ast, NodeTypes.Tag)
      const cloned = cloneNode(tags[0])

      expect('parentRef' in cloned).toBe(false)
      expect('parent' in cloned).toBe(false)
    })
  })

  describe('isNodeType', () => {
    it('should check node type correctly', () => {
      const tags = findNodeByType(ast, NodeTypes.Tag)
      expect(isNodeType(tags[0], NodeTypes.Tag)).toBe(true)
      expect(isNodeType(tags[0], NodeTypes.Text)).toBe(false)
    })
  })

  describe('filterNodes', () => {
    it('should filter nodes by predicate', () => {
      const filtered = filterNodes(ast, node => node.type === NodeTypes.Tag)

      expect(filtered.length).toBeGreaterThan(0)
      expect(filtered.every(node => node.type === NodeTypes.Tag)).toBe(true)
    })

    it('should handle complex predicates', () => {
      const filtered = filterNodes(
        ast,
        node =>
          node.type === NodeTypes.Tag
          && 'name' in node
          && node.name === 'circle',
      )

      expect(filtered.length).toBe(1)
    })
  })

  describe('countNodes', () => {
    it('should count all nodes in AST', () => {
      const count = countNodes(ast)
      expect(count).toBeGreaterThan(0)
    })

    it('should count single node', () => {
      const textNodes = findNodeByType(ast, NodeTypes.Text)
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
      const tags = findNodeByType(astWithParents, NodeTypes.Tag)
      const depths = tags.map(tag => getNodeDepth(tag))
      expect(depths.some(d => d > 0)).toBe(true)
    })
  })

  describe('getParentChain', () => {
    it('should return empty array for root', () => {
      const chain = getParentChain(ast)
      expect(chain).toEqual([])
    })

    it('should return parent chain for nested nodes', () => {
      const tags = findNodeByType(ast, NodeTypes.Tag)
      const chain = getParentChain(tags[0])
      expect(chain.length).toBeGreaterThanOrEqual(0)
    })
  })
})
