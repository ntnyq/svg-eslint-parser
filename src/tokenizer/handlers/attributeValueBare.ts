import {
  SPECIAL_CHAR,
  TokenizerContextTypes,
  TokenTypes,
} from '../../constants'
import { calculateTokenPosition, isWhitespace } from '../../utils'
import type { TokenizerState } from '../../types'
import type { CharsBuffer } from '../charsBuffer'

export function parse(chars: CharsBuffer, state: TokenizerState) {
  const value = chars.value()

  if (
    isWhitespace(value)
    || value === SPECIAL_CHAR.closingCorner
    || value === SPECIAL_CHAR.slash
  ) {
    return parseValueEnd(state)
  }

  state.accumulatedContent.concatBuffer(state.decisionBuffer)
  state.decisionBuffer.clear()
  state.sourceCode.next()
}

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
