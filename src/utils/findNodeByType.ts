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

    // Traverse children
    if ('children' in currentNode && Array.isArray(currentNode.children)) {
      for (const child of currentNode.children) {
        traverse(child)
      }
    }

    // Traverse attributes for Tag nodes
    if ('attributes' in currentNode && Array.isArray(currentNode.attributes)) {
      for (const attr of currentNode.attributes) {
        traverse(attr as AnyNode)
      }
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

    // Traverse children
    if ('children' in currentNode && Array.isArray(currentNode.children)) {
      for (const child of currentNode.children) {
        const result = traverse(child)
        if (result) {
          return result
        }
      }
    }

    // Traverse attributes
    if ('attributes' in currentNode && Array.isArray(currentNode.attributes)) {
      for (const attr of currentNode.attributes) {
        const result = traverse(attr as AnyNode)
        if (result) {
          return result
        }
      }
    }

    return undefined
  }

  return traverse(node)
}
