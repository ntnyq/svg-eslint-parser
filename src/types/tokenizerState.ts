import type { TokenizerContextTypes } from '../constants'
import type { CharsBuffer } from '../tokenizer/charsBuffer'
import type { SourceCode } from '../tokenizer/sourceCode'
import type { AnyToken } from './ast'
import type { ParseError } from './errors'

/**
 * Mutable state shared by tokenizer handlers.
 */
export type TokenizerState = {
  accumulatedContent: CharsBuffer
  contextParams: ContextParams
  currentContext: TokenizerContextTypes
  decisionBuffer: CharsBuffer
  errors: ParseError[]
  sourceCode: SourceCode
  tokens: {
    push(...tokens: AnyToken[]): void
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
  [TokenizerContextTypes.DoctypeInternalSubset]?: {
    quote?: '"' | "'"
  }
  [TokenizerContextTypes.OpenTagEnd]?: {
    tagName: string
  }
  [TokenizerContextTypes.XMLDeclarationAttributeValueWrapped]?: {
    wrapper: string
  }
}
