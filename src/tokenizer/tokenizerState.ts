import type { ParseDiagnostic } from '../diagnostics/types'
import type { CharsBuffer } from './charsBuffer'
import type { SourceCode } from './sourceCode'
import type { AnyToken } from './token'
import type { TokenizerContextTypes } from './tokenizerContextTypes'

/**
 * Mutable state shared by tokenizer handlers.
 */
export type TokenizerState = {
  accumulatedContent: CharsBuffer
  contextParams: ContextParams
  currentContext: TokenizerContextTypes
  decisionBuffer: CharsBuffer
  errors: ParseDiagnostic[]
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
    mode?: 'comment' | 'instruction'
    quote?: '"' | "'"
  }
  [TokenizerContextTypes.OpenTagEnd]?: {
    tagName: string
  }
  [TokenizerContextTypes.XMLDeclarationAttributeValueWrapped]?: {
    wrapper: string
  }
}
