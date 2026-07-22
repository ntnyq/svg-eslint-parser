import { TokenizerContextTypes, TokenTypes } from '../../constants'
import type { Range, TokenizerState } from '../../types'
import type { CharsBuffer } from '../charsBuffer'

function appendDecisionBuffer(state: TokenizerState): void {
  state.accumulatedContent.concatBuffer(state.decisionBuffer)
  state.decisionBuffer.clear()
  state.sourceCode.next()
}

function parseSubsetEnd(state: TokenizerState): void {
  const rawValue =
    state.accumulatedContent.value() + state.decisionBuffer.value().slice(0, -1)
  const range: Range = [
    state.sourceCode.index() - rawValue.length,
    state.sourceCode.index(),
  ]

  state.tokens.push({
    type: TokenTypes.DoctypeInternalSubset,
    value: rawValue.slice(1, -1),
    range,
    loc: state.sourceCode.getLocationOf(range),
  })

  state.accumulatedContent.clear()
  state.decisionBuffer.clear()
  state.currentContext = TokenizerContextTypes.DoctypeClose
  state.contextParams[TokenizerContextTypes.DoctypeInternalSubset] = undefined
}

/**
 * Tokenize a doctype internal subset while respecting quoted delimiters.
 */
export function parse(chars: CharsBuffer, state: TokenizerState): void {
  const value = chars.value()
  const params =
    state.contextParams[TokenizerContextTypes.DoctypeInternalSubset]
  const quote = params?.quote

  if (quote) {
    if (value === quote) {
      params.quote = undefined
    }
    appendDecisionBuffer(state)
    return
  }

  if (value === '"' || value === "'") {
    if (params) {
      params.quote = value
    }
    appendDecisionBuffer(state)
    return
  }

  if (value === ']') {
    state.sourceCode.next()
    return
  }

  if (value === ']>') {
    parseSubsetEnd(state)
    return
  }

  appendDecisionBuffer(state)
}
