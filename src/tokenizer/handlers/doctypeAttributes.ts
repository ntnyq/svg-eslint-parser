import {
  SPECIAL_CHAR,
  TokenizerContextTypes,
  TokenTypes,
} from '../../constants'
import { isWhitespace } from '../../utils'
import type { Range, TokenizerState } from '../../types'
import type { CharsBuffer } from '../charsBuffer'

export function parse(chars: CharsBuffer, state: TokenizerState) {
  const value = chars.value()

  if (
    value === SPECIAL_CHAR.doubleQuote
    || value === SPECIAL_CHAR.singleQuote
  ) {
    return parseWrapper(state)
  }

  if (value === SPECIAL_CHAR.closingCorner) {
    return parseClosingCornerBrace(state)
  }

  if (!isWhitespace(value)) {
    return parseBare(state)
  }

  state.decisionBuffer.clear()
  state.sourceCode.next()
}

function parseWrapper(state: TokenizerState) {
  const wrapper = state.decisionBuffer.value()
  const range: Range = [
    state.sourceCode.index(),
    state.sourceCode.index() + wrapper.length,
  ]

  state.tokens.push({
    type: TokenTypes.DoctypeAttributeWrapperStart,
    value: wrapper,
    range,
    loc: state.sourceCode.getLocationOf(range),
  })

  state.accumulatedContent.clear()
  state.decisionBuffer.clear()
  state.currentContext = TokenizerContextTypes.DoctypeAttributeWrapped
  state.contextParams[TokenizerContextTypes.DoctypeAttributeWrapped] = {
    wrapper,
  }
  state.sourceCode.next()
}

function parseClosingCornerBrace(state: TokenizerState) {
  state.accumulatedContent.clear()
  state.decisionBuffer.clear()
  state.currentContext = TokenizerContextTypes.DoctypeClose
}

function parseBare(state: TokenizerState) {
  state.accumulatedContent.replace(state.decisionBuffer)
  state.decisionBuffer.clear()
  state.currentContext = TokenizerContextTypes.DoctypeAttributeBare
  state.sourceCode.next()
}
