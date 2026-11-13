import { clearParent } from '../ast/clearParent'
import { sortDiagnostics } from '../diagnostics/sortDiagnostics'
import { tokenize } from '../tokenizer'
import { constructTree } from '../treeBuilder'
import { validateDocument } from './validateDocument'
import type { ParseResult } from './types'

/**
 * Parse SVG source independently of ESLint. Always return the recovered
 * document, all source tokens, and diagnostics for callers to apply error policy.
 * @param source - SVG source code
 * @returns Direct parser result with document AST, tokens, and diagnostics
 */
export function parseSource(source: string): ParseResult {
  const { errors: tokenizerErrors, tokens } = tokenize(source)
  const {
    ast,
    errors: constructorErrors,
    warnings,
  } = constructTree(tokens, source)
  const validationErrors = validateDocument(ast, tokens)
  const errors = sortDiagnostics([
    ...tokenizerErrors,
    ...constructorErrors,
    ...validationErrors,
  ])

  return {
    ast: clearParent(ast),
    errors,
    tokens,
    warnings: sortDiagnostics(warnings),
  }
}
