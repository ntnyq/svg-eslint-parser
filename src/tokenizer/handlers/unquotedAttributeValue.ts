import { calculateTokenPosition } from '../calculateTokenPosition'
import { isWhitespace } from '../isWhitespace'
import { SPECIAL_CHAR } from '../specialChar'
import { TokenizerContextTypes } from '../tokenizerContextTypes'
import { TokenTypes } from '../tokenTypes'
import type { CharsBuffer } from '../charsBuffer'
import type { TokenizerState } from '../tokenizerState'

function parseValueEnd(state: TokenizerState) {
  const position = calculateTokenPosition(state, { keepBuffer: false })

  state.tokens.push({
    type: TokenTypes.AttributeValue,
    value: state.accumulatedContent.value(),
    range: position.range,
    loc: position.loc,
  })

  state.accumulatedContent.clear()
  state.decisionBuffer.clear()
  state.currentContext = TokenizerContextTypes.Attributes
}

/**
 * Tokenize an unquoted element attribute value.
 */
export function parse(chars: CharsBuffer, state: TokenizerState) {
  const value = chars.value()

  if (
    isWhitespace(value) ||
    value === SPECIAL_CHAR.closingCorner ||
    value === SPECIAL_CHAR.slash
  ) {
    return parseValueEnd(state)
  }

  state.accumulatedContent.concatBuffer(state.decisionBuffer)
  state.decisionBuffer.clear()
  state.sourceCode.next()
}
