import type { CharsBuffer } from '../tokenizer/charsBuffer'
import type { TokenizerState } from './tokenizerState'

export interface TokenizeHandler {
  parse: (chars: CharsBuffer, state: TokenizerState) => void
  handleContentEnd?: (state: TokenizerState) => void
}
