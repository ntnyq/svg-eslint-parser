import { traverseAST } from './traverseAST'
import { visitorKeys } from './visitorKeys'
import type { AnyNode } from './types'

/**
 * Filter nodes by a predicate function
 * @param node - Root node to filter from
 * @param predicate - Filter function
 * @returns Array of matching nodes
 */
export function filterNodes(
  node: AnyNode,
  predicate: (node: AnyNode) => boolean,
): AnyNode[] {
  const results: AnyNode[] = []

  traverseAST(node, {
    enter(currentNode) {
      if (predicate(currentNode)) {
        results.push(currentNode)
      }
    },
  })
  return results
}

/**
 * Map AST nodes in preorder, updating child slots on the returned objects.
 * Tokens, comments metadata, and parent links are not traversed or rebuilt.
 * @param node - Root node to map from
 * @param mapper - Mapping function
 * @returns Transformed node
 */
export function mapNodes(
  node: AnyNode,
  mapper: (node: AnyNode) => AnyNode,
): AnyNode {
  let root = node
  const stack: {
    node: AnyNode
    replace: (mapped: AnyNode) => void
  }[] = [
    {
      node,
      replace(mapped) {
        root = mapped
      },
    },
  ]

  while (stack.length > 0) {
    const frame = stack.pop()
    if (!frame) {
      continue
    }
    const mapped = mapper(frame.node)
    frame.replace(mapped)
    const keys = visitorKeys[mapped.type] ?? []

    for (let keyIndex = keys.length - 1; keyIndex >= 0; keyIndex--) {
      const key = keys[keyIndex]
      // Visitor keys identify only AST child slots on the discriminated union.
      const value = Reflect.get(mapped, key) as AnyNode | AnyNode[] | undefined
      if (Array.isArray(value)) {
        for (let index = value.length - 1; index >= 0; index--) {
          stack.push({
            node: value[index],
            replace(child) {
              value[index] = child
            },
          })
        }
      } else if (value) {
        stack.push({
          node: value,
          replace(child) {
            Reflect.set(mapped, key, child)
          },
        })
      }
    }
  }

  return root
}

/**
 * Get all parent nodes from a node up to the root
 * @param node - Starting node
 * @returns Array of parent nodes (from immediate parent to root)
 */
export function getParentChain(node: any): AnyNode[] {
  const chain: AnyNode[] = []
  let current = node.parentRef || node.parent

  while (current) {
    chain.push(current)
    current = current.parentRef || current.parent
  }

  return chain
}

/**
 * Get the depth of a node in the AST (distance from root)
 * @param node - Node to measure
 * @returns Depth level (root = 0)
 */
export function getNodeDepth(node: any): number {
  let depth = 0
  let current = node.parentRef || node.parent

  while (current) {
    depth++
    current = current.parentRef || current.parent
  }

  return depth
}

/**
 * Count total number of nodes in the AST
 * @param node - Root node
 * @returns Total node count
 */
export function countNodes(node: AnyNode): number {
  let count = 0

  traverseAST(node, {
    enter() {
      count++
    },
  })

  return count
}
