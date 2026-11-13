import { calculateTokenPosition } from '../calculateTokenPosition'
import { isWhitespace } from '../isWhitespace'
import { SPECIAL_CHAR } from '../specialChar'
import { TokenizerContextTypes } from '../tokenizerContextTypes'
import { TokenTypes } from '../tokenTypes'
import type { CharsBuffer } from '../charsBuffer'
import type { TokenizerState } from '../tokenizerState'

function parseTagEnd(state: TokenizerState) {
  const tagName = state.contextParams[TokenizerContextTypes.Attributes]?.tagName

  state.accumulatedContent.clear()
  state.decisionBuffer.clear()
  state.currentContext = TokenizerContextTypes.OpenTagEnd
  state.contextParams[TokenizerContextTypes.OpenTagEnd] = { tagName: tagName! }
  state.contextParams[TokenizerContextTypes.Attributes] = undefined
}

function parseEqual(state: TokenizerState) {
  const position = calculateTokenPosition(state, { keepBuffer: true })

  state.tokens.push({
    type: TokenTypes.AttributeAssignment,
    value: state.decisionBuffer.value(),
    range: position.range,
    loc: position.loc,
  })

  state.accumulatedContent.clear()
  state.decisionBuffer.clear()
  state.currentContext = TokenizerContextTypes.AttributeValue
  state.sourceCode.next()
}

function startAttributeName(chars: CharsBuffer, state: TokenizerState) {
  state.accumulatedContent.replace(state.decisionBuffer)
  state.currentContext = TokenizerContextTypes.AttributeKey
  state.decisionBuffer.clear()
  state.sourceCode.next()
}

/**
 * Tokenize whitespace, assignments, and attribute starts inside an open tag.
 */
export function parse(chars: CharsBuffer, state: TokenizerState) {
  const value = chars.value()

  if (value === SPECIAL_CHAR.closingCorner || value === SPECIAL_CHAR.slash) {
    return parseTagEnd(state)
  }

  if (value === SPECIAL_CHAR.equal) {
    return parseEqual(state)
  }

  if (!isWhitespace(value)) {
    return startAttributeName(chars, state)
  }

  state.decisionBuffer.clear()
  state.sourceCode.next()
}
