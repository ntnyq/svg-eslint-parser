import type { DocumentNode } from '../types'

/**
 * Remove parent references from an AST without recursive calls.
 * @param ast - The AST node to clean
 * @returns The cleaned AST with parentRef properties removed
 */
export function clearParent(ast: any): DocumentNode {
  const stack = [ast]

  while (stack.length > 0) {
    const node = stack.pop()

    if (!node) {
      continue
    }

    delete node.parentRef

    if (Array.isArray(node.children)) {
      for (const child of node.children) {
        stack.push(child)
      }
    }
  }

  return ast as DocumentNode
}
