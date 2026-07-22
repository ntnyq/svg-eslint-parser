import { TokenizerContextTypes } from '../constants'
import { CharsBuffer } from './charsBuffer'
import { finalizeTokenizer } from './finalize'
import {
  attributeKey,
  attributes,
  attributeValue,
  attributeValueBare,
  attributeValueWrapped,
  cdataContent,
  closeTag,
  commentContent,
  data,
  doctypeAttributeBare,
  doctypeAttributes,
  doctypeAttributeWrapped,
  doctypeClose,
  doctypeOpen,
  noop,
  openTagEnd,
  openTagStart,
  processingInstruction,
  xmlDeclarationAttributeKey,
  xmlDeclarationAttributes,
  xmlDeclarationAttributeValue,
  xmlDeclarationAttributeValueWrapped,
  xmlDeclarationClose,
  xmlDeclarationOpen,
} from './handlers'
import { SourceCode } from './sourceCode'
import type { AnyToken, TokenizeHandler, TokenizerState } from '../types'

const contextHandlers: Record<TokenizerContextTypes, TokenizeHandler> = {
  [TokenizerContextTypes.Data]: data,
  [TokenizerContextTypes.CDATAContent]: cdataContent,

  [TokenizerContextTypes.XMLDeclarationOpen]: xmlDeclarationOpen,
  [TokenizerContextTypes.XMLDeclarationClose]: xmlDeclarationClose,
  [TokenizerContextTypes.XMLDeclarationAttributes]: xmlDeclarationAttributes,
  [TokenizerContextTypes.XMLDeclarationAttributeKey]:
    xmlDeclarationAttributeKey,
  [TokenizerContextTypes.XMLDeclarationAttributeValue]:
    xmlDeclarationAttributeValue,
  [TokenizerContextTypes.XMLDeclarationAttributeValueWrapped]:
    xmlDeclarationAttributeValueWrapped,

  [TokenizerContextTypes.Attributes]: attributes,
  [TokenizerContextTypes.AttributeKey]: attributeKey,
  [TokenizerContextTypes.AttributeValue]: attributeValue,
  [TokenizerContextTypes.AttributeValueBare]: attributeValueBare,
  [TokenizerContextTypes.AttributeValueWrapped]: attributeValueWrapped,

  [TokenizerContextTypes.OpenTagStart]: openTagStart,
  [TokenizerContextTypes.OpenTagEnd]: openTagEnd,
  [TokenizerContextTypes.ProcessingInstruction]: processingInstruction,
  [TokenizerContextTypes.CloseTag]: closeTag,

  [TokenizerContextTypes.DoctypeOpen]: doctypeOpen,
  [TokenizerContextTypes.DoctypeClose]: doctypeClose,
  [TokenizerContextTypes.DoctypeAttributes]: doctypeAttributes,
  [TokenizerContextTypes.DoctypeAttributeBare]: doctypeAttributeBare,
  [TokenizerContextTypes.DoctypeAttributeWrapped]: doctypeAttributeWrapped,

  [TokenizerContextTypes.CommentContent]: commentContent,
  [TokenizerContextTypes.CommentOpen]: noop,
  [TokenizerContextTypes.CommentClose]: noop,
}

function tokenizeChars(state: TokenizerState) {
  while (!state.sourceCode.isEof()) {
    const handler = contextHandlers[state.currentContext]
    state.decisionBuffer.concat(state.sourceCode.current())
    handler.parse(state.decisionBuffer, state)
  }

  const handler = contextHandlers[state.currentContext]

  state.sourceCode.prev()

  if (handler.handleContentEnd !== undefined) {
    handler.handleContentEnd(state)
  }

  finalizeTokenizer(state)
}

/**
 * Tokenize SVG source into parser tokens.
 * @param source - SVG source code
 * @returns Tokenizer state and emitted tokens
 */
export function tokenize(source: string): {
  errors: TokenizerState['errors']
  state: TokenizerState
  tokens: AnyToken[]
} {
  const tokens: AnyToken[] = []
  const state: TokenizerState = {
    contextParams: {},
    currentContext: TokenizerContextTypes.Data,
    errors: [],
    sourceCode: new SourceCode(source),
    decisionBuffer: new CharsBuffer(),
    accumulatedContent: new CharsBuffer(),
    tokens: {
      push(...newTokens: AnyToken[]) {
        tokens.push(...newTokens)
      },
    },
  }

  tokenizeChars(state)

  return {
    errors: state.errors,
    state,
    tokens,
  }
}
