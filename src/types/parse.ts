import type { SourceCode } from 'eslint'
import type { AnyToken, DocumentNode, Program } from './ast'
import type { ParseError } from './errors'

/**
 * Parser options accepted by direct and ESLint parse entry points.
 */
export interface Options {
  comment?: boolean
  /**
   * eslint features
   */
  eslintScopeManager?: boolean
  eslintVisitorKeys?: boolean

  filePath?: string
  /**
   * required for eslint parse
   */
  loc?: boolean

  range?: boolean
  tokens?: boolean
}

/**
 * @see {@link https://eslint.org/docs/latest/extend/custom-parsers#parseforeslint-return-object}
 */
export interface ParseForESLintResult {
  ast: Program
  scopeManager: any
  visitorKeys: SourceCode.VisitorKeys
  services: {
    errors: ParseError[]
    isSVG: boolean
    warnings: ParseError[]
  }
}

/**
 * Result returned by the direct parser entry point.
 */
export interface ParseResult {
  ast: DocumentNode
  errors: ParseError[]
  tokens: AnyToken[]
  warnings: ParseError[]
}
