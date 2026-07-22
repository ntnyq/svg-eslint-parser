import {
  PROCESSING_INSTRUCTION_END,
  TokenizerContextTypes,
  TokenTypes,
} from '../../constants'
import { calculateTokenPosition } from '../../utils'
import type { TokenizerState } from '../../types'
import type { CharsBuffer } from '../charsBuffer'

function parseInstructionEnd(state: TokenizerState): void {
  const position = calculateTokenPosition(state, { keepBuffer: true })

  state.tokens.push({
    type: TokenTypes.ProcessingInstruction,
    value: state.accumulatedContent.value() + state.decisionBuffer.value(),
    range: position.range,
    loc: position.loc,
  })

  state.accumulatedContent.clear()
  state.decisionBuffer.clear()
  state.currentContext = TokenizerContextTypes.Data
  state.sourceCode.next()
}

/**
 * Tokenize a processing instruction as an opaque XML construct.
 */
export function parse(chars: CharsBuffer, state: TokenizerState): void {
  const value = chars.value()

  if (value === '?') {
    state.sourceCode.next()
    return
  }

  if (value === PROCESSING_INSTRUCTION_END) {
    parseInstructionEnd(state)
    return
  }

  state.accumulatedContent.concatBuffer(state.decisionBuffer)
  state.decisionBuffer.clear()
  state.sourceCode.next()
}
