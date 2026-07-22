import { meta } from './meta'
import { ParseError, parseForESLint } from './parser'
import { visitorKeys } from './visitorKeys'
import type { DocumentNode, Options } from './types'
import type * as AST from './types'

/**
 * Parser package name.
 */
export const name = meta.name

/**
 * ESLint visitor keys for parser-specific nodes.
 */
export const VisitorKeys = visitorKeys

/**
 * Parse SVG source and return the document node directly.
 * @param code - SVG source code
 * @param options - Parser options
 * @returns Parsed SVG document node
 */
export function parse(code: string, options: Options = {}): DocumentNode {
  return parseForESLint(code, options).ast.document
}

export { meta }
export * from './types'
export * from './constants'
export { ParseError }
export { parseForESLint }

export type { AST }

export { defineSVGRule } from './defineSVGRule'

// Utility functions
export {
  cloneNode,
  cloneNodeWithParent,
  countNodes,
  filterNodes,
  findFirstNodeByType,
  findNodeByType,
  getNodeDepth,
  getParentChain,
  isNodeType,
  mapNodes,
  traverseAST,
  validateNode,
  walkAST,
} from './utils'
export type { ASTVisitor } from './utils'
