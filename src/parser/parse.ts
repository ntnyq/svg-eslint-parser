import { constructTree } from '../constructor'
import { tokenize } from '../tokenizer'
import { clearParent } from '../utils'
import { validateDocument } from './validateDocument'
import type { Options, ParseResult } from '../types'

/**
 * Parse SVG source into a document AST and token list.
 * @param source - SVG source code
 * @param _options - Parser options reserved for API compatibility
 * @returns Direct parser result with document AST, tokens, and diagnostics
 */
export function parse(source: string, _options: Options = {}): ParseResult {
  const { errors: tokenizerErrors, tokens } = tokenize(source)
  const {
    ast,
    errors: constructorErrors,
    warnings,
  } = constructTree(tokens, source)
  const validationErrors = validateDocument(ast, tokens)
  const errors = [...tokenizerErrors, ...constructorErrors, ...validationErrors]

  return {
    ast: clearParent(ast),
    errors,
    tokens,
    warnings,
  }
}
