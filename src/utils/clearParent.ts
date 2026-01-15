import type { DocumentNode } from '../types'

/**
 * Recursively remove parent references from an AST
 * @param ast - The AST node to clean
 * @returns The cleaned AST with parentRef properties removed
 */
export function clearParent(ast: any): DocumentNode {
  const cleanAst = ast

  delete cleanAst.parentRef

  if (Array.isArray(ast.children)) {
    cleanAst.children = ast.children.map((node: any) => {
      return clearParent(node)
    })
  }

  return cleanAst as DocumentNode
}
