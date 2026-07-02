import { constructTree } from '../constructor'
import { tokenize } from '../tokenizer'
import { clearParent } from '../utils'
import type { Options, ParseResult } from '../types'

/**
 * Parse SVG source into a document AST and token list.
 * @param source - SVG source code
 * @param _options - Parser options reserved for API compatibility
 * @returns Direct parser result with document AST, tokens, and diagnostics
 */
export function parse(source: string, _options: Options = {}): ParseResult {
  const { tokens } = tokenize(source)
  const { ast, errors, warnings } = constructTree(tokens)

  return {
    ast: clearParent(ast),
    errors,
    tokens,
    warnings,
  }
}
