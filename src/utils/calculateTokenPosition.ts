import { calculateTokenCharactersRange } from './calculateTokenCharactersRange'
import { calculateTokenLocation } from './calculateTokenLocation'
import type { TokenizerState } from '../types'

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
