import { TokenizerContextTypes, TokenTypes } from '../../constants'
import { calculateTokenPosition } from '../../utils'
import type { Range, TokenizerState } from '../../types'
import type { CharsBuffer } from '../charsBuffer'

export function parse(chars: CharsBuffer, state: TokenizerState) {
  const value = chars.value()
  const wrapperChar =
    state.contextParams[TokenizerContextTypes.DoctypeAttributeWrapped]?.wrapper

  if (value === wrapperChar) {
    return parseWrapper(state)
  }

  state.accumulatedContent.concatBuffer(state.decisionBuffer)
  state.decisionBuffer.clear()
  state.sourceCode.next()
}

function parseWrapper(state: TokenizerState) {
  const position = calculateTokenPosition(state, { keepBuffer: false })
  const endWrapperPosition = position.range[1]

  state.tokens.push({
    type: TokenTypes.DoctypeAttributeValue,
    value: state.accumulatedContent.value(),
    range: position.range,
    loc: position.loc,
  })

  const range: Range = [endWrapperPosition, endWrapperPosition + 1]

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
