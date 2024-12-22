import { TokenTypes } from '../../constants'
import { cloneLocation, cloneRange, createNodeFrom, last, updateNodeEnd } from '../../utils'
import type {
  AnyToken,
  AttributeValueNode,
  AttributeValueWrapperEndNode,
  AttributeValueWrapperStartNode,
  ConstructTreeState,
  ContextualTagNode,
  Token,
} from '../../types'

const VALUE_END_TOKENS = new Set([
  TokenTypes.OpenTagEnd,
  TokenTypes.AttributeKey,
  TokenTypes.AttributeAssignment,
])

export function construct(token: AnyToken, state: ConstructTreeState<ContextualTagNode>) {
  if (VALUE_END_TOKENS.has(token.type)) {
    return handleValueEnd(state)
  }

  if (token.type === TokenTypes.AttributeValue) {
    return handleAttributeValue(state, token)
  }

  if (token.type === TokenTypes.AttributeValueWrapperStart) {
    return handleAttributeValueWrapperStart(state, token)
  }

  if (token.type === TokenTypes.AttributeValueWrapperEnd) {
    return handleAttributeValueWrapperEnd(state, token)
  }

  state.caretPosition++

  return state
}

function getLastAttribute(state: ConstructTreeState<ContextualTagNode>) {
  const attributes = state.currentNode.attributes
  return last(attributes)
}

function handleValueEnd(state: ConstructTreeState<ContextualTagNode>) {
  state.currentContext = state.currentContext.parentRef

  return state
}

function handleAttributeValue(state: ConstructTreeState<ContextualTagNode>, token: AnyToken) {
  const attribute = getLastAttribute(state)

  attribute.value = createNodeFrom(token) as AttributeValueNode

  updateNodeEnd(attribute, token)

  state.caretPosition++

  return state
}

function handleAttributeValueWrapperStart(
  state: ConstructTreeState<ContextualTagNode>,
  token: Token<TokenTypes.AttributeValueWrapperStart>,
) {
  const attribute = getLastAttribute(state)

  attribute.startWrapper = createNodeFrom(token) as AttributeValueWrapperStartNode

  if (!attribute.key) {
    attribute.range = cloneRange(token.range)
    attribute.loc = cloneLocation(token.loc)
  }

  state.caretPosition++

  return state
}

function handleAttributeValueWrapperEnd(
  state: ConstructTreeState<ContextualTagNode>,
  token: Token<TokenTypes.AttributeValueWrapperEnd>,
) {
  const attribute = getLastAttribute(state)

  attribute.endWrapper = createNodeFrom(token) as AttributeValueWrapperEndNode

  updateNodeEnd(attribute, token)

  state.caretPosition++

  return state
}
