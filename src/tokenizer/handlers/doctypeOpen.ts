import { calculateTokenPosition } from '../calculateTokenPosition'
import { isWhitespace } from '../isWhitespace'
import { SPECIAL_CHAR } from '../specialChar'
import { TokenizerContextTypes } from '../tokenizerContextTypes'
import { TokenTypes } from '../tokenTypes'
import type { CharsBuffer } from '../charsBuffer'
import type { AnyToken } from '../token'
import type { TokenizerState } from '../tokenizerState'

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

/**
 * Tokenize the opening delimiter of a doctype declaration.
 */
export function parse(chars: CharsBuffer, state: TokenizerState) {
  const value = chars.value()

  if (isWhitespace(value)) {
    return parseWhitespace(state)
  }

  if (value === SPECIAL_CHAR.closingCorner) {
    return parseClosingCornerBrace(state)
  }

  state.accumulatedContent.concatBuffer(state.decisionBuffer)
  state.decisionBuffer.clear()
  state.sourceCode.next()
}
