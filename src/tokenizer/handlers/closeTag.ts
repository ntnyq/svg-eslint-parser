import { calculateTokenPosition } from '../calculateTokenPosition'
import { SPECIAL_CHAR } from '../specialChar'
import { TokenizerContextTypes } from '../tokenizerContextTypes'
import { TokenTypes } from '../tokenTypes'
import type { CharsBuffer } from '../charsBuffer'
import type { TokenizerState } from '../tokenizerState'

function parseClosingCornerBrace(state: TokenizerState) {
  const position = calculateTokenPosition(state, { keepBuffer: true })

  state.tokens.push({
    type: TokenTypes.CloseTag,
    value: state.accumulatedContent.value() + state.decisionBuffer.value(),
    range: position.range,
    loc: position.loc,
  })

  state.accumulatedContent.clear()
  state.decisionBuffer.clear()
  state.currentContext = TokenizerContextTypes.Data
  state.sourceCode.next()
}

/**
 * Tokenize a closing tag.
 */
export function parse(chars: CharsBuffer, state: TokenizerState) {
  const value = chars.value()

  if (value === SPECIAL_CHAR.closingCorner) {
    return parseClosingCornerBrace(state)
  }

  state.accumulatedContent.concatBuffer(state.decisionBuffer)
  state.decisionBuffer.clear()
  state.sourceCode.next()
}
