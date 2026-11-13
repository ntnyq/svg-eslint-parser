import { calculateTokenPosition } from '../calculateTokenPosition'
import { SPECIAL_CHAR } from '../specialChar'
import { TokenizerContextTypes } from '../tokenizerContextTypes'
import { TokenTypes } from '../tokenTypes'
import type { CharsBuffer } from '../charsBuffer'
import type { TokenizerState } from '../tokenizerState'

function parseClosingCornerBrace(state: TokenizerState) {
  const position = calculateTokenPosition(state, { keepBuffer: true })
  // const tagName = state.contextParams[TokenizerContextTypes.OpenTagEnd]?.tagName

  state.tokens.push({
    type: TokenTypes.OpenTagEnd,
    value: state.accumulatedContent.value() + state.decisionBuffer.value(),
    range: position.range,
    loc: position.loc,
  })

  state.accumulatedContent.clear()
  state.decisionBuffer.clear()
  state.currentContext = TokenizerContextTypes.Data
  state.sourceCode.next()
  state.contextParams[TokenizerContextTypes.OpenTagEnd] = undefined
}

/**
 * Tokenize the opening delimiter of an XML declaration.
 */
export function parse(chars: CharsBuffer, state: TokenizerState) {
  if (chars.value() === SPECIAL_CHAR.closingCorner) {
    return parseClosingCornerBrace(state)
  }

  state.accumulatedContent.concatBuffer(state.decisionBuffer)
  state.decisionBuffer.clear()
  state.sourceCode.next()
}
