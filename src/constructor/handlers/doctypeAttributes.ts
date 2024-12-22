import { ConstructTreeContextTypes, NodeTypes, TokenTypes } from '../../constants'
import { cloneLocation, cloneRange, initAttributesIfNone } from '../../utils'
import type { AnyToken, ConstructTreeState, ContextualDoctypeNode } from '../../types'

const ATTRIBUTE_START_TOKENS = new Set([
  TokenTypes.DoctypeAttributeWrapperStart,
  TokenTypes.DoctypeAttributeValue,
])

export function construct(token: AnyToken, state: ConstructTreeState<ContextualDoctypeNode>) {
  if (token.type === TokenTypes.DoctypeClose) {
    return handleDoctypeClose(state)
  }

  if (ATTRIBUTE_START_TOKENS.has(token.type)) {
    return handleAttribute(state, token)
  }

  state.caretPosition++

  return state
}

function handleDoctypeClose(state: ConstructTreeState<ContextualDoctypeNode>) {
  state.currentContext = state.currentContext.parentRef

  return state
}

function handleAttribute(state: ConstructTreeState<ContextualDoctypeNode>, token: AnyToken) {
  initAttributesIfNone(state.currentNode)

  // mew empty attributes
  state.currentNode.attributes.push({
    type: NodeTypes.DoctypeAttribute,
    range: cloneRange(token.range),
    loc: cloneLocation(token.loc),
  })

  state.currentContext = {
    type: ConstructTreeContextTypes.DoctypeAttribute,
    parentRef: state.currentContext,
  }

  return state
}
