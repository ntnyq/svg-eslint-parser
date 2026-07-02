import {
  SPECIAL_CHAR,
  TokenizerContextTypes,
  TokenTypes,
  XML_DECLARATION_END,
} from '../../constants'
import { calculateTokenPosition, isWhitespace } from '../../utils'
import type { Range, TokenizerState } from '../../types'
import type { CharsBuffer } from '../charsBuffer'

function parseXMLDeclarationClose(state: TokenizerState) {
  const position = calculateTokenPosition(state, { keepBuffer: false })
  const endRange: Range = [
    position.range[1],
    position.range[1] + XML_DECLARATION_END.length,
  ]

  state.tokens.push({
    type: TokenTypes.XMLDeclarationClose,
    value: state.decisionBuffer.value(),
    range: endRange,
    loc: state.sourceCode.getLocationOf(endRange),
  })

  state.accumulatedContent.clear()
  state.decisionBuffer.clear()
  state.currentContext = TokenizerContextTypes.Data
  state.sourceCode.next()
}

function parseEqual(state: TokenizerState) {
  const position = calculateTokenPosition(state, { keepBuffer: true })

  state.tokens.push({
    type: TokenTypes.XMLDeclarationAttributeAssignment,
    value: state.decisionBuffer.value(),
    range: position.range,
    loc: position.loc,
  })

  state.accumulatedContent.clear()
  state.decisionBuffer.clear()
  state.currentContext = TokenizerContextTypes.XMLDeclarationAttributeValue
  state.sourceCode.next()
}

function parseNoneWhitespace(state: TokenizerState) {
  state.accumulatedContent.replace(state.decisionBuffer)
  state.currentContext = TokenizerContextTypes.XMLDeclarationAttributeKey
  state.decisionBuffer.clear()
  state.sourceCode.next()
}

/**
 * Tokenize XML declaration attributes and the declaration close transition.
 */
export function parse(chars: CharsBuffer, state: TokenizerState) {
  const value = chars.value()

  if (value === SPECIAL_CHAR.question) {
    return state.sourceCode.next()
  }

  if (value === XML_DECLARATION_END) {
    return parseXMLDeclarationClose(state)
  }

  if (value === SPECIAL_CHAR.equal) {
    return parseEqual(state)
  }

  if (!isWhitespace(value)) {
    return parseNoneWhitespace(state)
  }

  state.decisionBuffer.clear()
  state.sourceCode.next()
}
