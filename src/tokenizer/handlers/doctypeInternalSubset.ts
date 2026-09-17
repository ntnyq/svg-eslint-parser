import { TokenizerContextTypes, TokenTypes } from '../../constants'
import type { Range, TokenizerState } from '../../types'
import type { CharsBuffer } from '../charsBuffer'

function appendDecisionBuffer(state: TokenizerState) {
  state.accumulatedContent.concatBuffer(state.decisionBuffer)
  state.decisionBuffer.clear()
  state.sourceCode.next()
}

function parseSubsetEnd(state: TokenizerState) {
  const rawValue =
    state.accumulatedContent.value() + state.decisionBuffer.value()
  const range: Range = [
    state.sourceCode.index() + 1 - rawValue.length,
    state.sourceCode.index() + 1,
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
  state.sourceCode.next()
}

/**
 * Tokenize an opaque internal subset, respecting quotes, comments, and PIs.
 */
export function parse(chars: CharsBuffer, state: TokenizerState) {
  const value = chars.value()
  const params =
    state.contextParams[TokenizerContextTypes.DoctypeInternalSubset]
  const quote = params?.quote
  const { source } = state.sourceCode
  const index = state.sourceCode.index()

  if (params?.mode) {
    const delimiter = params.mode === 'comment' ? '-->' : '?>'
    if (source.slice(index + 1 - delimiter.length, index + 1) === delimiter) {
      params.mode = undefined
    }
    appendDecisionBuffer(state)
    return
  }

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

  if (
    params &&
    (source.startsWith('<!--', index) || source.startsWith('<?', index))
  ) {
    params.mode = source.startsWith('<!--', index) ? 'comment' : 'instruction'
    appendDecisionBuffer(state)
    return
  }

  if (value === ']') {
    parseSubsetEnd(state)
    return
  }

  appendDecisionBuffer(state)
}
