import { SPECIAL_CHAR, TokenizerContextTypes, TokenTypes } from '../../constants'
import { calculateTokenPosition } from '../../utils'
import type { TokenizerState } from '../../types'
import type { CharsBuffer } from '../charsBuffer'

export function parse(chars: CharsBuffer, state: TokenizerState) {
  const value = chars.value()

  if (value === SPECIAL_CHAR.closingCorner) {
    return parseClosingCornerBrace(state)
  }

  state.accumulatedContent.concatBuffer(state.decisionBuffer)
  state.decisionBuffer.clear()
  state.sourceCode.next()
}

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
