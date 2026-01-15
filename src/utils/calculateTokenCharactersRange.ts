import type { Range, TokenizerState } from '../types'

/**
 * Calculate the character range of a token based on tokenizer state
 * @param state - Current tokenizer state
 * @param options - Configuration options
 * @param options.keepBuffer - Whether to include decision buffer in the range
 * @returns Array containing [startPosition, endPosition + 1]
 */
export function calculateTokenCharactersRange(
  state: TokenizerState,
  options: { keepBuffer: boolean },
): Range {
  const startPosition =
    state.sourceCode.index()
    - (state.accumulatedContent.length() - 1)
    - state.decisionBuffer.length()

  let endPosition

  if (options.keepBuffer) {
    endPosition = state.sourceCode.index()
  } else {
    endPosition = state.sourceCode.index() - state.decisionBuffer.length()
  }

  return [startPosition, endPosition + 1]
}
