import { throwIfParseError } from './errorPolicy'
import { parseSource } from './parseSource'
import type { DocumentNode } from '../ast/types'
import type { Options } from './types'

/**
 * Parse SVG source and return its document without creating an ESLint Program.
 * @param source - SVG source code
 * @param options - Parser options, including error recovery
 * @returns Parsed SVG document node
 */
export function parse(source: string, options: Options = {}): DocumentNode {
  const { ast, errors } = parseSource(source)
  throwIfParseError(errors, options)
  return ast
}
