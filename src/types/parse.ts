import type { SourceCode } from 'eslint'
import type { AnyToken, DocumentNode, Program } from './ast'

export interface Options {
  comment?: boolean
  filePath?: string
  tokens?: boolean

  /**
   * required for eslint parse
   */
  loc?: boolean
  range?: boolean

  /**
   * eslint features
   */
  eslintScopeManager?: boolean
  eslintVisitorKeys?: boolean
}

/**
 * @see {@link https://eslint.org/docs/latest/extend/custom-parsers#parseforeslint-return-object}
 */
export interface ParseForESLintResult {
  ast: Program
  // TODO: implement this
  scopeManager: any
  services: { isSVG: boolean }
  visitorKeys: SourceCode.VisitorKeys
}

export interface ParseResult {
  ast: DocumentNode
  tokens: AnyToken[]
}
