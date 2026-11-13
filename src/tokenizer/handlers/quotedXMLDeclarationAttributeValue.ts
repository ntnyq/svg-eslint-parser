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
    type: TokenTypes.XMLDeclarationAttributeValue,
    value: state.accumulatedContent.value(),
    range: position.range,
    loc: position.loc,
  })

  const range: Range = [closingQuoteOffset, closingQuoteOffset + 1]

  state.tokens.push({
    type: TokenTypes.XMLDeclarationAttributeValueWrapperEnd,
    value: state.decisionBuffer.value(),
    range,
    loc: state.sourceCode.getLocationOf(range),
  })

  state.accumulatedContent.clear()
  state.decisionBuffer.clear()
  state.currentContext = TokenizerContextTypes.XMLDeclarationAttributes
  state.sourceCode.next()

  state.contextParams[
    TokenizerContextTypes.XMLDeclarationAttributeValueWrapped
  ] = undefined
}

/**
 * Tokenize a quoted XML declaration attribute value.
 */
export function parse(chars: CharsBuffer, state: TokenizerState) {
  const quote =
    state.contextParams[
      TokenizerContextTypes.XMLDeclarationAttributeValueWrapped
    ]?.wrapper

  if (chars.value() === quote) {
    return finishQuotedValue(state)
  }

  state.accumulatedContent.concatBuffer(state.decisionBuffer)
  state.decisionBuffer.clear()
  state.sourceCode.next()
}
