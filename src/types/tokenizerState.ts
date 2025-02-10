import type { TokenizerContextTypes } from '../constants'
import type { CharsBuffer } from '../tokenizer/charsBuffer'
import type { SourceCode } from '../tokenizer/sourceCode'
import type { AnyToken } from './ast'

export type TokenizerState = {
  accumulatedContent: CharsBuffer
  contextParams: ContextParams
  currentContext: TokenizerContextTypes
  decisionBuffer: CharsBuffer
  sourceCode: SourceCode
  tokens: {
    push(token: AnyToken): void
  }
}

type ContextParams = {
  [TokenizerContextTypes.Attributes]?: {
    tagName: string
  }
  [TokenizerContextTypes.AttributeValueWrapped]?: {
    wrapper: string
  }
  [TokenizerContextTypes.DoctypeAttributeWrapped]?: {
    wrapper: string
  }
  [TokenizerContextTypes.OpenTagEnd]?: {
    tagName: string
  }
  [TokenizerContextTypes.XMLDeclarationAttributeValueWrapped]?: {
    wrapper: string
  }
}
