import type { CharsBuffer } from '../tokenizer/charsBuffer'
import type { TokenizerState } from './tokenizerState'

/**
 * Tokenizer handler for a single tokenizer context.
 */
export interface TokenizeHandler {
  parse: (chars: CharsBuffer, state: TokenizerState) => void
  handleContentEnd?: (state: TokenizerState) => void
}
