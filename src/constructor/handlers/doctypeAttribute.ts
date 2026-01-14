import { TokenTypes } from '../../constants'
import {
  cloneRange,
  createNodeFrom,
  getLastAttribute,
  updateNodeEnd,
} from '../../utils'
import type {
  AnyToken,
  ConstructTreeState,
  ContextualDoctypeNode,
  DoctypeAttributeValueNode,
} from '../../types'

export function construct(
  token: AnyToken,
  state: ConstructTreeState<ContextualDoctypeNode>,
) {
  if (token.type === TokenTypes.DoctypeClose) {
    return handleDoctypeClose(state)
  }

  if (token.type === TokenTypes.DoctypeAttributeWrapperStart) {
    return handleDoctypeAttributeWrapperStart(state, token)
  }

  if (token.type === TokenTypes.DoctypeAttributeWrapperEnd) {
    return handleDoctypeAttributeWrapperEnd(state, token)
  }

  if (token.type === TokenTypes.DoctypeAttributeValue) {
    return handleDoctypeAttributeValue(state, token)
  }

  state.caretPosition++

  return state
}

function handleDoctypeClose(state: ConstructTreeState<ContextualDoctypeNode>) {
  state.currentContext = state.currentContext.parentRef

  return state
}

function handleDoctypeAttributeWrapperStart(
  state: ConstructTreeState<ContextualDoctypeNode>,
  token: AnyToken,
) {
  const attribute = getLastAttribute(state)

  if (attribute.value !== undefined) {
    state.currentContext = state.currentContext.parentRef

    return state
  }

  attribute.quoteChar = token.value as any
  attribute.range = cloneRange(token.range)

  state.caretPosition++

  return state
}

function handleDoctypeAttributeWrapperEnd(
  state: ConstructTreeState<ContextualDoctypeNode>,
  token: AnyToken,
) {
  const attribute = getLastAttribute(state)

  updateNodeEnd(attribute, token)

  state.currentContext = state.currentContext.parentRef

  state.caretPosition++

  return state
}

function handleDoctypeAttributeValue(
  state: ConstructTreeState<ContextualDoctypeNode>,
  token: AnyToken,
) {
  const attribute = getLastAttribute(state)

  if (attribute.value !== undefined) {
    state.currentContext = state.currentContext.parentRef

    return state
  }

  attribute.value = createNodeFrom(token) as DoctypeAttributeValueNode

  if (!attribute.quoteChar) {
    attribute.range = cloneRange(token.range)
  }

  state.caretPosition++

  return state
}
