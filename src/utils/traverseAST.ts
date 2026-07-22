import { getChildNodes } from './getChildNodes'
import type { AnyNode } from '../types'

/**
 * Visitor function for AST traversal
 */
export type ASTVisitor = {
  /**
   * Called when entering a node
   * Return false to skip traversing children
   */
  enter?: (node: AnyNode, parent: AnyNode | null) => void | boolean
  /**
   * Called when leaving a node
   */
  leave?: (node: AnyNode, parent: AnyNode | null) => void
}

interface TraversalFrame {
  node: AnyNode
  parent: AnyNode | null
  leaving: boolean
}

/**
 * Traverse the AST with a visitor pattern
 * @param node - Root node to traverse from
 * @param visitor - Visitor object with enter/leave hooks
 * @param parent - Parent node (used internally)
 */
export function traverseAST(
  node: AnyNode,
  visitor: ASTVisitor,
  parent: AnyNode | null = null,
): void {
  const stack: TraversalFrame[] = [{ node, parent, leaving: false }]

  while (stack.length > 0) {
    const frame = stack.pop()

    if (!frame) {
      continue
    }

    if (frame.leaving) {
      visitor.leave?.(frame.node, frame.parent)
      continue
    }

    const shouldTraverseChildren =
      visitor.enter?.(frame.node, frame.parent) !== false

    if (visitor.leave) {
      stack.push({ ...frame, leaving: true })
    }

    if (shouldTraverseChildren) {
      const children = getChildNodes(frame.node)

      for (let index = children.length - 1; index >= 0; index--) {
        stack.push({
          node: children[index],
          parent: frame.node,
          leaving: false,
        })
      }
    }
  }
}

/**
 * Simple traversal function that calls a callback for each node
 * @param node - Root node to traverse from
 * @param callback - Function to call for each node
 */
export function walkAST(
  node: AnyNode,
  callback: (node: AnyNode, parent: AnyNode | null) => void,
): void {
  traverseAST(node, {
    enter: callback,
  })
}
