import { getChildNodes } from '../utils/getChildNodes'
import type { AnyNode } from '../types'

type Visitor = (node: AnyNode) => void

/**
 * Walk an AST node tree using the parser visitor keys.
 * @param node - Root node to visit
 * @param visitor - Callback invoked for each reachable node
 */
export function traverse(node: AnyNode, visitor: Visitor) {
  if (!node) {
    return
  }

  const stack = [node]

  while (stack.length > 0) {
    const currentNode = stack.pop()

    if (!currentNode) {
      continue
    }

    visitor(currentNode)

    const children = getChildNodes(currentNode)

    for (let index = children.length - 1; index >= 0; index--) {
      stack.push(children[index])
    }
  }
}
