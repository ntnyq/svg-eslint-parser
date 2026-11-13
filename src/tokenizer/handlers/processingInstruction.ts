import { PROCESSING_INSTRUCTION_END } from '../../syntax/constants'
import { calculateTokenPosition } from '../calculateTokenPosition'
import { Chars } from '../chars'
import { TokenizerContextTypes } from '../tokenizerContextTypes'
import { TokenTypes } from '../tokenTypes'
import type { CharsBuffer } from '../charsBuffer'
import type { TokenizerState } from '../tokenizerState'

function parseInstructionEnd(state: TokenizerState) {
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
export function parse(chars: CharsBuffer, state: TokenizerState) {
  const value = chars.value()

  if (value === '??') {
    const start = state.sourceCode.index() - value.length + 1
    state.accumulatedContent.concat(new Chars('?', [start, start + 1]))
    state.decisionBuffer.clear()
    state.decisionBuffer.concat(
      new Chars(value.slice(1), [start + 1, state.sourceCode.index() + 1]),
    )
    state.sourceCode.next()
    return
  }

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
