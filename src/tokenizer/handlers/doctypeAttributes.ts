import { isWhitespace } from '../isWhitespace'
import { SPECIAL_CHAR } from '../specialChar'
import { TokenizerContextTypes } from '../tokenizerContextTypes'
import { TokenTypes } from '../tokenTypes'
import type { Range } from '../../source/types'
import type { CharsBuffer } from '../charsBuffer'
import type { TokenizerState } from '../tokenizerState'

function startQuotedValue(state: TokenizerState) {
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

function parseInternalSubset(state: TokenizerState) {
  state.accumulatedContent.replace(state.decisionBuffer)
  state.decisionBuffer.clear()
  state.currentContext = TokenizerContextTypes.DoctypeInternalSubset
  state.contextParams[TokenizerContextTypes.DoctypeInternalSubset] = {}
  state.sourceCode.next()
}

function startUnquotedValue(state: TokenizerState) {
  state.accumulatedContent.replace(state.decisionBuffer)
  state.decisionBuffer.clear()
  state.currentContext = TokenizerContextTypes.DoctypeAttributeBare
  state.sourceCode.next()
}

/**
 * Tokenize doctype attributes and the doctype close transition.
 */
export function parse(chars: CharsBuffer, state: TokenizerState) {
  const value = chars.value()

  if (
    value === SPECIAL_CHAR.doubleQuote ||
    value === SPECIAL_CHAR.singleQuote
  ) {
    return startQuotedValue(state)
  }

  if (value === SPECIAL_CHAR.closingCorner) {
    return parseClosingCornerBrace(state)
  }

  if (value === '[') {
    return parseInternalSubset(state)
  }

  if (!isWhitespace(value)) {
    return startUnquotedValue(state)
  }

  state.decisionBuffer.clear()
  state.sourceCode.next()
}
