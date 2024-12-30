import { SPECIAL_CHAR, TokenizerContextTypes, TokenTypes } from '../../constants'
import { calculateTokenPosition, isWhitespace } from '../../utils'
import type { TokenizerState } from '../../types'
import type { CharsBuffer } from '../charsBuffer'

export function parse(chars: CharsBuffer, state: TokenizerState) {
  const value = chars.value()

  if (isWhitespace(value) || value === SPECIAL_CHAR.closingCorner) {
    return parseAttributeEnd(state)
  }

  state.accumulatedContent.concatBuffer(state.decisionBuffer)
  state.decisionBuffer.clear()
  state.sourceCode.next()
}

function parseAttributeEnd(state: TokenizerState) {
  const position = calculateTokenPosition(state, { keepBuffer: false })

  state.tokens.push({
    type: TokenTypes.DoctypeAttributeValue,
    value: state.accumulatedContent.value(),
    range: position.range,
    loc: position.loc,
  })

  state.accumulatedContent.clear()
  state.decisionBuffer.clear()
  state.currentContext = TokenizerContextTypes.DoctypeAttributes
}
