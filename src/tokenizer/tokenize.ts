import { CharsBuffer } from './charsBuffer'
import { finalizeTokenizer } from './finalize'
import {
  attributeKey,
  attributes,
  attributeValue,
  cdataContent,
  closeTag,
  commentContent,
  data,
  doctypeAttributes,
  doctypeClose,
  doctypeInternalSubset,
  doctypeOpen,
  noop,
  openTagEnd,
  openTagStart,
  processingInstruction,
  quotedAttributeValue,
  quotedDoctypeAttribute,
  quotedXMLDeclarationAttributeValue,
  unquotedAttributeValue,
  unquotedDoctypeAttribute,
  xmlDeclarationAttributeKey,
  xmlDeclarationAttributes,
  xmlDeclarationAttributeValue,
  xmlDeclarationClose,
  xmlDeclarationOpen,
} from './handlers'
import { SourceCode } from './sourceCode'
import { TokenizerContextTypes } from './tokenizerContextTypes'
import type { AnyToken } from './token'
import type { TokenizeHandler } from './tokenizerContextHandler'
import type { TokenizerState } from './tokenizerState'

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
    quotedXMLDeclarationAttributeValue,

  [TokenizerContextTypes.Attributes]: attributes,
  [TokenizerContextTypes.AttributeKey]: attributeKey,
  [TokenizerContextTypes.AttributeValue]: attributeValue,
  [TokenizerContextTypes.AttributeValueBare]: unquotedAttributeValue,
  [TokenizerContextTypes.AttributeValueWrapped]: quotedAttributeValue,

  [TokenizerContextTypes.OpenTagStart]: openTagStart,
  [TokenizerContextTypes.OpenTagEnd]: openTagEnd,
  [TokenizerContextTypes.ProcessingInstruction]: processingInstruction,
  [TokenizerContextTypes.CloseTag]: closeTag,

  [TokenizerContextTypes.DoctypeOpen]: doctypeOpen,
  [TokenizerContextTypes.DoctypeClose]: doctypeClose,
  [TokenizerContextTypes.DoctypeInternalSubset]: doctypeInternalSubset,
  [TokenizerContextTypes.DoctypeAttributes]: doctypeAttributes,
  [TokenizerContextTypes.DoctypeAttributeBare]: unquotedDoctypeAttribute,
  [TokenizerContextTypes.DoctypeAttributeWrapped]: quotedDoctypeAttribute,

  [TokenizerContextTypes.CommentContent]: commentContent,
  [TokenizerContextTypes.CommentOpen]: noop,
  [TokenizerContextTypes.CommentClose]: noop,
}

/**
 * Run tokenizer contexts, rejecting stalls, cursor jumps, and cycles while
 * reprocessing the same source character.
 */
export function tokenizeChars(
  state: TokenizerState,
  handlers: Partial<
    Record<TokenizerContextTypes, TokenizeHandler>
  > = contextHandlers,
) {
  const visitedContexts = new Set<TokenizerContextTypes>()
  while (!state.sourceCode.isEof()) {
    const sourceOffset = state.sourceCode.index()
    const context = state.currentContext
    if (visitedContexts.has(context)) {
      throw new Error(
        `Tokenizer context cycle at offset ${sourceOffset} (${context}).`,
      )
    }
    visitedContexts.add(context)
    const handler = handlers[context]
    if (!handler) {
      throw new Error(`Missing tokenizer handler for ${context}.`)
    }
    state.decisionBuffer.concat(state.sourceCode.current())
    handler.parse(state.decisionBuffer, state)
    const offsetAdvance = state.sourceCode.index() - sourceOffset
    if (offsetAdvance !== 0 && offsetAdvance !== 1) {
      throw new Error(
        `Tokenizer must consume exactly one character or reprocess it (${context}).`,
      )
    }
    if (offsetAdvance === 0 && state.currentContext === context) {
      throw new Error(
        `Tokenizer made no progress at offset ${sourceOffset} (${context}).`,
      )
    }
    if (offsetAdvance === 1) {
      visitedContexts.clear()
    }
  }

  const handler = handlers[state.currentContext]

  state.sourceCode.prev()

  if (handler?.handleContentEnd !== undefined) {
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
