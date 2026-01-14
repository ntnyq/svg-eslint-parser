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
  // Enter node
  let shouldTraverseChildren = true
  if (visitor.enter) {
    const result = visitor.enter(node, parent)
    if (result === false) {
      shouldTraverseChildren = false
    }
  }

  // Traverse children if not skipped
  if (shouldTraverseChildren) {
    // Traverse child nodes
    if ('children' in node && Array.isArray(node.children)) {
      for (const child of node.children) {
        traverseAST(child, visitor, node)
      }
    }

    // Traverse attributes
    if ('attributes' in node && Array.isArray(node.attributes)) {
      for (const attr of node.attributes) {
        traverseAST(attr as AnyNode, visitor, node)
      }
    }
  }

  // Leave node
  if (visitor.leave) {
    visitor.leave(node, parent)
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
