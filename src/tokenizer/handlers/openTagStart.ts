import {
  SPECIAL_CHAR,
  TokenizerContextTypes,
  TokenTypes,
} from '../../constants'
import {
  calculateTokenPosition,
  isWhitespace,
  parseOpenTagName,
} from '../../utils'
import type { TokenizerState } from '../../types'
import type { CharsBuffer } from '../charsBuffer'

export function parse(chars: CharsBuffer, state: TokenizerState) {
  const value = chars.value()

  if (value === SPECIAL_CHAR.closingCorner || value === SPECIAL_CHAR.slash) {
    return parseTagEnd(state)
  }

  if (isWhitespace(value)) {
    return parseWhitespace(state)
  }

  state.accumulatedContent.concatBuffer(state.decisionBuffer)
  state.decisionBuffer.clear()
  state.sourceCode.next()
}

function parseTagEnd(state: TokenizerState) {
  const tagName = parseOpenTagName(state.accumulatedContent.value())
  const position = calculateTokenPosition(state, { keepBuffer: false })

  state.tokens.push({
    type: TokenTypes.OpenTagStart,
    value: state.accumulatedContent.value(),
    range: position.range,
    loc: position.loc,
  })

  state.accumulatedContent.clear()
  state.decisionBuffer.clear()
  state.currentContext = TokenizerContextTypes.OpenTagEnd
  state.contextParams[TokenizerContextTypes.OpenTagEnd] = { tagName }
}

function parseWhitespace(state: TokenizerState) {
  const tagName = parseOpenTagName(state.accumulatedContent.value())
  const position = calculateTokenPosition(state, { keepBuffer: false })

  state.tokens.push({
    type: TokenTypes.OpenTagStart,
    value: state.accumulatedContent.value(),
    range: position.range,
    loc: position.loc,
  })

  state.accumulatedContent.clear()
  state.decisionBuffer.clear()
  state.currentContext = TokenizerContextTypes.Attributes
  state.contextParams[TokenizerContextTypes.Attributes] = { tagName }
  state.sourceCode.next()
}
