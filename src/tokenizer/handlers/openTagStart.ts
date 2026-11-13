import { parseOpenTagName } from '../../syntax/parseOpenTagName'
import { calculateTokenPosition } from '../calculateTokenPosition'
import { isWhitespace } from '../isWhitespace'
import { SPECIAL_CHAR } from '../specialChar'
import { TokenizerContextTypes } from '../tokenizerContextTypes'
import { TokenTypes } from '../tokenTypes'
import type { CharsBuffer } from '../charsBuffer'
import type { TokenizerState } from '../tokenizerState'

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

/**
 * Tokenize the start of an opening tag.
 */
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
