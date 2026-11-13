import type { ParseDiagnostic } from './types'

/**
 * Return diagnostics in source order without mutating their input. Stable
 * sorting preserves reporting order for diagnostics at the same start offset.
 */
export function sortDiagnostics(
  diagnostics: readonly ParseDiagnostic[],
): ParseDiagnostic[] {
  return [...diagnostics].sort((left, right) => left.range[0] - right.range[0])
}
