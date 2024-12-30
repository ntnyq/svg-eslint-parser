import { ConstructTreeContextTypes, TokenTypes } from '../../constants'
import { createNodeFrom, getLastAttribute } from '../../utils'
import type { AnyToken, AttributeKeyNode, ConstructTreeState, ContextualTagNode } from '../../types'

const OPEN_TAG_END_TOKENS = new Set([TokenTypes.OpenTagEnd])

export function construct(token: AnyToken, state: ConstructTreeState<ContextualTagNode>) {
  if (OPEN_TAG_END_TOKENS.has(token.type)) {
    return handleOpenTagEnd(state)
  }

  if (token.type === TokenTypes.AttributeKey) {
    return handleAttributeKey(state, token)
  }

  if (token.type === TokenTypes.AttributeAssignment) {
    return handleAttributeAssignment(state)
  }

  state.caretPosition++

  return state
}

function handleOpenTagEnd(state: ConstructTreeState<ContextualTagNode>) {
  state.currentContext = state.currentContext.parentRef

  return state
}

function handleAttributeKey(state: ConstructTreeState<ContextualTagNode>, token: AnyToken) {
  const attribute = getLastAttribute(state)

  if (attribute.key !== undefined || attribute.value !== undefined) {
    state.currentContext = state.currentContext.parentRef

    return state
  }

  attribute.key = createNodeFrom(token) as AttributeKeyNode

  state.caretPosition++

  return state
}

function handleAttributeAssignment(state: ConstructTreeState<ContextualTagNode>) {
  const attribute = getLastAttribute(state)

  if (attribute.value !== undefined) {
    state.currentContext = state.currentContext.parentRef

    return state
  }

  state.currentContext = {
    parentRef: state.currentContext,
    type: ConstructTreeContextTypes.AttributeValue,
  }

  state.caretPosition++

  return state
}
