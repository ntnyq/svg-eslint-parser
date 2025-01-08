import { TokenizerContextTypes } from '../constants'
import { CharsBuffer } from './charsBuffer'
import {
  attributeKey,
  attributes,
  attributeValue,
  attributeValueBare,
  attributeValueWrapped,
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
}

export function tokenize(source: string): {
  state: TokenizerState
  tokens: AnyToken[]
} {
  const tokens: AnyToken[] = []
  const state: TokenizerState = {
    contextParams: {},
    currentContext: TokenizerContextTypes.Data,
    sourceCode: new SourceCode(source),
    decisionBuffer: new CharsBuffer(),
    accumulatedContent: new CharsBuffer(),
    tokens: {
      push(token: AnyToken) {
        tokens.push(token)
      },
    },
  }

  tokenizeChars(state)

  return {
    state,
    tokens,
  }
}
