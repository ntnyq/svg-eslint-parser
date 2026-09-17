import { CDATA_END, TokenizerContextTypes, TokenTypes } from '../../constants'
import { calculateTokenPosition } from '../../utils'
import { Chars } from '../chars'
import type { Range, TokenizerState } from '../../types'
import type { CharsBuffer } from '../charsBuffer'

function parseCDATAClose(state: TokenizerState) {
  const position = calculateTokenPosition(state, { keepBuffer: false })
  const closeRange: Range = [
    position.range[1],
    position.range[1] + CDATA_END.length,
  ]

  state.tokens.push(
    {
      type: TokenTypes.CDATAContent,
      value: state.accumulatedContent.value(),
      range: position.range,
      loc: position.loc,
    },
    {
      type: TokenTypes.CDATAClose,
      value: state.decisionBuffer.value(),
      range: closeRange,
      loc: state.sourceCode.getLocationOf(closeRange),
    },
  )

  state.accumulatedContent.clear()
  state.decisionBuffer.clear()
  state.currentContext = TokenizerContextTypes.Data
  state.sourceCode.next()
}

/**
 * Tokenize raw CDATA content until its closing delimiter.
 */
export function parse(chars: CharsBuffer, state: TokenizerState) {
  const value = chars.value()

  if (value === ']]]') {
    const start = state.sourceCode.index() - value.length + 1
    state.accumulatedContent.concat(new Chars(']', [start, start + 1]))
    state.decisionBuffer.clear()
    state.decisionBuffer.concat(
      new Chars(value.slice(1), [start + 1, state.sourceCode.index() + 1]),
    )
    state.sourceCode.next()
    return
  }

  if (value === ']' || value === ']]') {
    state.sourceCode.next()
    return
  }

  if (value === CDATA_END) {
    parseCDATAClose(state)
    return
  }

  state.accumulatedContent.concatBuffer(state.decisionBuffer)
  state.decisionBuffer.clear()
  state.sourceCode.next()
}
