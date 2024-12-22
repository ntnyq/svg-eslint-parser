import { ConstructTreeContextTypes, SELF_CLOSING_ELEMENTS, TokenTypes } from '../../constants'
import { createNodeFrom, updateNodeEnd } from '../../utils'
import type {
  AnyToken,
  CloseTagNode,
  ConstructTreeState,
  ContextualTagNode,
  OpenTagEndNode,
  OpenTagStartNode,
  Token,
} from '../../types'

const ATTRIBUTE_START_TOKENS = new Set([TokenTypes.AttributeKey, TokenTypes.AttributeAssignment])

export function construct(token: AnyToken, state: ConstructTreeState<ContextualTagNode>) {
  if (token.type === TokenTypes.OpenTagStart) {
    return handleOpenTagStart(state, token)
  }

  if (ATTRIBUTE_START_TOKENS.has(token.type)) {
    return handleAttributeStart(state)
  }

  if (token.type === TokenTypes.OpenTagEnd) {
    return handleOpenTagEnd(state, token)
  }

  if (token.type === TokenTypes.CloseTag) {
    return handleCloseTag(state, token)
  }

  state.caretPosition++

  return state
}

function handleOpenTagStart(
  state: ConstructTreeState<ContextualTagNode>,
  token: Token<TokenTypes.OpenTagStart>,
) {
  state.currentNode.openStart = createNodeFrom(token) as OpenTagStartNode
  state.currentContext = {
    parentRef: state.currentContext,
    type: ConstructTreeContextTypes.TagName,
  }

  return state
}

function handleAttributeStart(state: ConstructTreeState<ContextualTagNode>) {
  state.currentContext = {
    parentRef: state.currentContext,
    type: ConstructTreeContextTypes.Attributes,
  }

  return state
}

function handleOpenTagEnd(
  state: ConstructTreeState<ContextualTagNode>,
  token: Token<TokenTypes.OpenTagEnd>,
) {
  const tagName = state.currentNode.name

  state.currentNode.openEnd = createNodeFrom(token) as OpenTagEndNode

  updateNodeEnd(state.currentNode, token)

  if (tagName && SELF_CLOSING_ELEMENTS.has(tagName) && state.currentNode.openEnd.value === '/>') {
    state.currentNode.selfClosing = true
    state.currentNode = state.currentNode.parentRef
    state.currentContext = state.currentContext.parentRef
    state.caretPosition++

    return state
  }

  state.currentNode.selfClosing = false
  state.currentContext = {
    parentRef: state.currentContext,
    type: ConstructTreeContextTypes.TagContent,
  }
  state.caretPosition++

  return state
}

function handleCloseTag(
  state: ConstructTreeState<ContextualTagNode>,
  token: Token<TokenTypes.CloseTag>,
) {
  state.currentNode.close = createNodeFrom(token) as CloseTagNode

  updateNodeEnd(state.currentNode, token)

  state.currentNode = state.currentNode.parentRef
  state.currentContext = state.currentContext.parentRef
  state.caretPosition++

  return state
}
