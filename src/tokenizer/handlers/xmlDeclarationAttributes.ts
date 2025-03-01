import {
  SPECIAL_CHAR,
  TokenizerContextTypes,
  TokenTypes,
  XML_DECLARATION_END,
} from '../../constants'
import { calculateTokenPosition } from '../../utils'
import type { Range, TokenizerState } from '../../types'
import type { CharsBuffer } from '../charsBuffer'

export function parse(chars: CharsBuffer, state: TokenizerState) {
  const value = chars.value()

  if (value === SPECIAL_CHAR.question || value === SPECIAL_CHAR.closingCorner) {
    return parseXMLDeclarationClose(state)
  }

  if (value === XML_DECLARATION_END) {
    return parseXMLDeclarationClose(state)
  }

  state.accumulatedContent.concatBuffer(state.decisionBuffer)
  state.decisionBuffer.clear()
  state.sourceCode.next()
}

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
