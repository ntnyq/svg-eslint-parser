import type { SourceCode } from 'eslint'
import type { AnyToken, DocumentNode, Program } from './ast'
import type { ParseError } from './errors'

/**
 * Parser options accepted by direct and ESLint parse entry points.
 */
export interface Options {
  comment?: boolean
  /**
   * Return a recovered AST and diagnostics instead of throwing the first
   * parser error.
   * @default false
   */
  errorRecovery?: boolean
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
 * Parser services exposed to ESLint rules through `context.sourceCode`.
 */
export interface SVGParserServices {
  errors: ParseError[]
  isSVG: true
  warnings: ParseError[]
}

/**
 * @see {@link https://eslint.org/docs/latest/extend/custom-parsers#parseforeslint-return-object}
 */
export interface ParseForESLintResult {
  ast: Program
  scopeManager: any
  services: SVGParserServices
  visitorKeys: SourceCode.VisitorKeys
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
