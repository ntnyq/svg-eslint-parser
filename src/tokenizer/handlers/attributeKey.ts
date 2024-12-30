import { SPECIAL_CHAR, TokenizerContextTypes, TokenTypes } from '../../constants'
import { calculateTokenPosition, isWhitespace } from '../../utils'
import type { TokenizerState } from '../../types'
import type { CharsBuffer } from '../charsBuffer'

export function parse(chars: CharsBuffer, state: TokenizerState) {
  if (isKeyBreak(chars)) {
    return parseKeyEnd(state)
  }

  state.accumulatedContent.concatBuffer(state.decisionBuffer)
  state.decisionBuffer.clear()
  state.sourceCode.next()
}

function isKeyBreak(chars: CharsBuffer): boolean {
  const value = chars.value()
  return (
    value === SPECIAL_CHAR.equal ||
    value === SPECIAL_CHAR.slash ||
    value === SPECIAL_CHAR.closingCorner ||
    isWhitespace(value)
  )
}

function parseKeyEnd(state: TokenizerState) {
  const position = calculateTokenPosition(state, { keepBuffer: false })

  state.tokens.push({
    type: TokenTypes.AttributeKey,
    value: state.accumulatedContent.value(),
    range: position.range,
    loc: position.loc,
  })

  state.accumulatedContent.clear()
  state.decisionBuffer.clear()
  state.currentContext = TokenizerContextTypes.Attributes
}
