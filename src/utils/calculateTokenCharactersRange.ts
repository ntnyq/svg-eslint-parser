import type { Range, TokenizerState } from '../types'

export function calculateTokenCharactersRange(
  state: TokenizerState,
  options: { keepBuffer: boolean },
): Range {
  const startPosition =
    state.sourceCode.index() -
    (state.accumulatedContent.length() - 1) -
    state.decisionBuffer.length()

  let endPosition

  if (options.keepBuffer) {
    endPosition = state.sourceCode.index() - state.decisionBuffer.length()
  } else {
    endPosition = state.sourceCode.index()
  }

  return [startPosition, endPosition]
}
