import { ParseError } from '../diagnostics/parseError'
import type { ParseDiagnostic } from '../diagnostics/types'
import type { Options } from './types'

/**
 * Apply the shared strict/recovery policy to ordered parser diagnostics.
 */
export function throwIfParseError(
  errors: readonly ParseDiagnostic[],
  options: Pick<Options, 'errorRecovery'>,
) {
  const [error] = errors
  if (options.errorRecovery || !error) {
    return
  }

  throw new ParseError(error.message, {
    cause: error,
    code: error.type,
    offset: error.range[0],
    line: error.loc.start.line,
    column: error.loc.start.column + 1,
  })
}
