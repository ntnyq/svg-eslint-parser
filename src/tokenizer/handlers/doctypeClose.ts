import { TokenizerContextTypes, TokenTypes } from '../../constants'
import { calculateTokenPosition, isWhitespace } from '../../utils'
import type { TokenizerState } from '../../types'
import type { CharsBuffer } from '../charsBuffer'

/**
 * Tokenize the closing delimiter of a doctype declaration.
 */
export function parse(chars: CharsBuffer, state: TokenizerState) {
  if (state.accumulatedContent.length() === 0 && isWhitespace(chars.value())) {
    state.decisionBuffer.clear()
    state.sourceCode.next()
    return
  }

  if (chars.value() !== '>') {
    state.accumulatedContent.concatBuffer(state.decisionBuffer)
    state.decisionBuffer.clear()
    state.sourceCode.next()
    return
  }

  const position = calculateTokenPosition(state, { keepBuffer: true })

  state.tokens.push({
    type: TokenTypes.DoctypeClose,
    value: state.accumulatedContent.value() + state.decisionBuffer.value(),
    range: position.range,
    loc: position.loc,
  })

  state.accumulatedContent.clear()
  state.decisionBuffer.clear()
  state.currentContext = TokenizerContextTypes.Data
  state.sourceCode.next()
}
