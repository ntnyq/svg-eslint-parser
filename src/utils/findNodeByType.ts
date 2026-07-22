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
  const stack = [node]

  while (stack.length > 0) {
    const currentNode = stack.pop()

    if (!currentNode) {
      continue
    }

    if (currentNode.type === type) {
      results.push(currentNode)
    }

    const children = getChildNodes(currentNode)

    for (let index = children.length - 1; index >= 0; index--) {
      stack.push(children[index])
    }
  }

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
  const stack = [node]

  while (stack.length > 0) {
    const currentNode = stack.pop()

    if (!currentNode) {
      continue
    }

    if (currentNode.type === type) {
      return currentNode
    }

    const children = getChildNodes(currentNode)

    for (let index = children.length - 1; index >= 0; index--) {
      stack.push(children[index])
    }
  }

  return undefined
}
