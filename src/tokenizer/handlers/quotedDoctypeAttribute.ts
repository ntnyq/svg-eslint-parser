import { calculateTokenPosition } from '../calculateTokenPosition'
import { TokenizerContextTypes } from '../tokenizerContextTypes'
import { TokenTypes } from '../tokenTypes'
import type { Range } from '../../source/types'
import type { CharsBuffer } from '../charsBuffer'
import type { TokenizerState } from '../tokenizerState'

function finishQuotedValue(state: TokenizerState) {
  const position = calculateTokenPosition(state, { keepBuffer: false })
  const closingQuoteOffset = position.range[1]

  state.tokens.push({
    type: TokenTypes.DoctypeAttributeValue,
    value: state.accumulatedContent.value(),
    range: position.range,
    loc: position.loc,
  })

  const range: Range = [closingQuoteOffset, closingQuoteOffset + 1]

  state.tokens.push({
    type: TokenTypes.DoctypeAttributeWrapperEnd,
    value: state.decisionBuffer.value(),
    range,
    loc: state.sourceCode.getLocationOf(range),
  })

  state.accumulatedContent.clear()
  state.decisionBuffer.clear()
  state.currentContext = TokenizerContextTypes.DoctypeAttributes
  state.sourceCode.next()

  state.contextParams[TokenizerContextTypes.DoctypeAttributeWrapped] = undefined
}

/**
 * Tokenize a quoted doctype attribute value.
 */
export function parse(chars: CharsBuffer, state: TokenizerState) {
  const value = chars.value()
  const quote =
    state.contextParams[TokenizerContextTypes.DoctypeAttributeWrapped]?.wrapper

  if (value === quote) {
    return finishQuotedValue(state)
  }

  state.accumulatedContent.concatBuffer(state.decisionBuffer)
  state.decisionBuffer.clear()
  state.sourceCode.next()
}
