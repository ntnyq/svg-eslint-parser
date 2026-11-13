import { getChildNodes } from './getChildNodes'
import type { NodeTypes } from './nodeTypes'
import type { AnyNode } from './types'

type NodeOfType<Type extends NodeTypes> = Extract<AnyNode, { type: Type }>

/**
 * Find all nodes of a specific type in the AST
 * @param node - Root node to search from
 * @param type - Node type to search for
 * @returns Array of matching nodes
 */
export function findNodesByType<Type extends NodeTypes>(
  node: AnyNode,
  type: Type,
): NodeOfType<Type>[] {
  const results: NodeOfType<Type>[] = []
  const stack = [node]

  while (stack.length > 0) {
    const currentNode = stack.pop()

    if (!currentNode) {
      continue
    }

    if (currentNode.type === type) {
      results.push(currentNode as NodeOfType<Type>)
    }

    const children = getChildNodes(currentNode)

    for (let index = children.length - 1; index >= 0; index--) {
      stack.push(children[index])
    }
  }

  return results
}

/**
 * Compatibility alias for the plural node query.
 */
export { findNodesByType as findNodeByType }

/**
 * Find the first node of a specific type in the AST
 * @param node - Root node to search from
 * @param type - Node type to search for
 * @returns First matching node or undefined
 */
export function findFirstNodeByType<Type extends NodeTypes>(
  node: AnyNode,
  type: Type,
): NodeOfType<Type> | undefined {
  const stack = [node]

  while (stack.length > 0) {
    const currentNode = stack.pop()

    if (!currentNode) {
      continue
    }

    if (currentNode.type === type) {
      return currentNode as NodeOfType<Type>
    }

    const children = getChildNodes(currentNode)

    for (let index = children.length - 1; index >= 0; index--) {
      stack.push(children[index])
    }
  }

  return undefined
}
