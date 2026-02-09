import type { TokenizerState } from '../types'
import { calculateTokenCharactersRange } from './calculateTokenCharactersRange'
import { calculateTokenLocation } from './calculateTokenLocation'

/**
 * Calculate both character range and source location of a token
 * @param state - Current tokenizer state
 * @param options - Configuration options
 * @param options.keepBuffer - Whether to include decision buffer in the range
 * @returns Object with range and location (loc) properties
 */
export function calculateTokenPosition(
  state: TokenizerState,
  options: { keepBuffer: boolean },
) {
  const range = calculateTokenCharactersRange(state, options)
  const loc = calculateTokenLocation(state.sourceCode.source, range)

  return {
    range,
    loc,
  }
}
