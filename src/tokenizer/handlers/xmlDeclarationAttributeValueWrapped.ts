import { TokenizerContextTypes, TokenTypes } from '../../constants'
import { calculateTokenPosition } from '../../utils'
import type { Range, TokenizerState } from '../../types'
import type { CharsBuffer } from '../charsBuffer'

function parseWrapper(state: TokenizerState) {
  const position = calculateTokenPosition(state, { keepBuffer: false })
  const endWrapperPosition = position.range[1]

  state.tokens.push({
    type: TokenTypes.XMLDeclarationAttributeValue,
    value: state.accumulatedContent.value(),
    range: position.range,
    loc: position.loc,
  })

  const range: Range = [endWrapperPosition, endWrapperPosition + 1]

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
  const wrapperChar =
    state.contextParams[
      TokenizerContextTypes.XMLDeclarationAttributeValueWrapped
    ]?.wrapper

  if (chars.value() === wrapperChar) {
    return parseWrapper(state)
  }

  state.accumulatedContent.concatBuffer(state.decisionBuffer)
  state.decisionBuffer.clear()
  state.sourceCode.next()
}
