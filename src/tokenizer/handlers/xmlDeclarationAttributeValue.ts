import { isWhitespace } from '../isWhitespace'
import { SPECIAL_CHAR } from '../specialChar'
import { TokenizerContextTypes } from '../tokenizerContextTypes'
import { TokenTypes } from '../tokenTypes'
import type { Range } from '../../source/types'
import type { CharsBuffer } from '../charsBuffer'
import type { TokenizerState } from '../tokenizerState'

function startQuotedValue(state: TokenizerState) {
  const wrapper = state.decisionBuffer.value()
  const range: Range = [state.sourceCode.index(), state.sourceCode.index() + 1]

  state.tokens.push({
    type: TokenTypes.XMLDeclarationAttributeValueWrapperStart,
    value: wrapper,
    range,
    loc: state.sourceCode.getLocationOf(range),
  })

  state.accumulatedContent.clear()
  state.decisionBuffer.clear()
  state.currentContext =
    TokenizerContextTypes.XMLDeclarationAttributeValueWrapped
  state.contextParams[
    TokenizerContextTypes.XMLDeclarationAttributeValueWrapped
  ] = {
    wrapper,
  }
  state.sourceCode.next()
}

function parseTagEnd(state: TokenizerState) {
  state.accumulatedContent.clear()
  state.decisionBuffer.clear()
  state.currentContext = TokenizerContextTypes.XMLDeclarationAttributes
}

function recoverUnquotedValue(state: TokenizerState) {
  const range: Range = [state.sourceCode.index(), state.sourceCode.index() + 1]

  state.tokens.push({
    type: TokenTypes.XMLDeclarationAttributeValue,
    value: state.decisionBuffer.value(),
    range,
    loc: state.sourceCode.getLocationOf(range),
  })

  state.accumulatedContent.clear()
  state.decisionBuffer.clear()
  state.currentContext = TokenizerContextTypes.XMLDeclarationAttributes
  state.sourceCode.next()
}

/**
 * Tokenize the start of an XML declaration attribute value.
 */
export function parse(chars: CharsBuffer, state: TokenizerState) {
  const value = chars.value()

  if (
    value === SPECIAL_CHAR.doubleQuote ||
    value === SPECIAL_CHAR.singleQuote
  ) {
    return startQuotedValue(state)
  }

  if (value === SPECIAL_CHAR.closingCorner || value === SPECIAL_CHAR.slash) {
    return parseTagEnd(state)
  }

  if (!isWhitespace(value)) {
    return recoverUnquotedValue(state)
  }

  state.decisionBuffer.clear()
  state.sourceCode.next()
}
