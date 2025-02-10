import {
  SPECIAL_CHAR,
  TokenizerContextTypes,
  TokenTypes,
} from '../../constants'
import { calculateTokenPosition, isWhitespace } from '../../utils'
import type { AnyToken, TokenizerState } from '../../types'
import type { CharsBuffer } from '../charsBuffer'

export function parse(chars: CharsBuffer, state: TokenizerState) {
  const value = chars.value()

  if (isWhitespace(value)) {
    return parseWhitespace(state)
  }

  if (value === SPECIAL_CHAR.closingCorner) {
    return parseClosingCornerBrace(state)
  }

  state.decisionBuffer.clear()
  state.sourceCode.next()
}

function generateDoctypeOpenToken(state: TokenizerState): AnyToken {
  const position = calculateTokenPosition(state, { keepBuffer: false })
  const token: AnyToken = {
    type: TokenTypes.DoctypeOpen,
    value: state.accumulatedContent.value(),
    range: position.range,
    loc: position.loc,
  }

  return token
}

function parseWhitespace(state: TokenizerState) {
  state.tokens.push(generateDoctypeOpenToken(state))

  state.accumulatedContent.clear()
  state.decisionBuffer.clear()
  state.currentContext = TokenizerContextTypes.DoctypeAttributes
}

function parseClosingCornerBrace(state: TokenizerState) {
  state.tokens.push(generateDoctypeOpenToken(state))

  state.accumulatedContent.clear()
  state.decisionBuffer.clear()
  state.currentContext = TokenizerContextTypes.DoctypeClose
}
