import { calculateTokenPosition } from '../calculateTokenPosition'
import { isWhitespace } from '../isWhitespace'
import { TokenizerContextTypes } from '../tokenizerContextTypes'
import { TokenTypes } from '../tokenTypes'
import type { CharsBuffer } from '../charsBuffer'
import type { TokenizerState } from '../tokenizerState'

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
