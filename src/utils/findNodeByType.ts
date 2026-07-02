import { getChildNodes } from './getChildNodes'
import type { NodeTypes } from '../constants'
import type { AnyNode } from '../types'

/**
 * Find all nodes of a specific type in the AST
 * @param node - Root node to search from
 * @param type - Node type to search for
 * @returns Array of matching nodes
 */
export function findNodeByType<T extends NodeTypes>(
  node: AnyNode,
  type: T,
): AnyNode[] {
  const results: AnyNode[] = []

  function traverse(currentNode: AnyNode) {
    if (currentNode.type === type) {
      results.push(currentNode)
    }

    for (const child of getChildNodes(currentNode)) {
      traverse(child)
    }
  }

  traverse(node)
  return results
}

/**
 * Find the first node of a specific type in the AST
 * @param node - Root node to search from
 * @param type - Node type to search for
 * @returns First matching node or undefined
 */
export function findFirstNodeByType<T extends NodeTypes>(
  node: AnyNode,
  type: T,
): AnyNode | undefined {
  function traverse(currentNode: AnyNode): AnyNode | undefined {
    if (currentNode.type === type) {
      return currentNode
    }

    for (const child of getChildNodes(currentNode)) {
      const result = traverse(child)
      if (result) {
        return result
      }
    }

    return undefined
  }

  return traverse(node)
}
