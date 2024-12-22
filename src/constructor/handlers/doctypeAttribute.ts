import { TokenTypes } from '../../constants'
import { cloneRange, createNodeFrom, last, updateNodeEnd } from '../../utils'
import type {
  AnyToken,
  ConstructTreeState,
  ContextualDoctypeNode,
  DoctypeAttributeValueNode,
  DoctypeAttributeWrapperEndNode,
  DoctypeAttributeWrapperStartNode,
} from '../../types'

export function construct(token: AnyToken, state: ConstructTreeState<ContextualDoctypeNode>) {
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

function getLastAttribute(state: ConstructTreeState<ContextualDoctypeNode>) {
  const attributes = state.currentNode.attributes
  return last(attributes)
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

  attribute.startWrapper = createNodeFrom(token) as DoctypeAttributeWrapperStartNode
  attribute.range = cloneRange(token.range)

  state.caretPosition++

  return state
}

function handleDoctypeAttributeWrapperEnd(
  state: ConstructTreeState<ContextualDoctypeNode>,
  token: AnyToken,
) {
  const attribute = getLastAttribute(state)

  attribute.endWrapper = createNodeFrom(token) as DoctypeAttributeWrapperEndNode

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

  if (!attribute.startWrapper) {
    attribute.range = cloneRange(token.range)
  }

  state.caretPosition++

  return state
}
