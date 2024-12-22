import type { SourceCode } from 'eslint'
import type { AnyToken, DocumentNode, Program } from './ast'

export interface Options {}

export interface ParseForESLintResult {
  ast: Program
  services: { isSVG: boolean }
  visitorKeys: SourceCode.VisitorKeys
}

export interface ParseResult {
  ast: DocumentNode
  tokens: AnyToken[]
}
