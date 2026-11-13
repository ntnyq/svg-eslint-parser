import type { DocumentNode } from '../ast/types'
import type { ParseDiagnostic } from '../diagnostics/types'
import type { AnyToken } from '../tokenizer/token'

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
 * Internal parseSource result before strict-mode policy or ESLint adaptation.
 */
export interface ParseResult {
  ast: DocumentNode
  errors: ParseDiagnostic[]
  tokens: AnyToken[]
  warnings: ParseDiagnostic[]
}
