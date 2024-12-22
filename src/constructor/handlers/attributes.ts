import { ConstructTreeContextTypes, NodeTypes, TokenTypes } from '../../constants'
import { cloneLocation, cloneRange, initAttributesIfNone } from '../../utils'
import type { AnyToken, ConstructTreeState, ContextualTagNode } from '../../types'

const ATTRIBUTE_START_TOKENS = new Set([TokenTypes.AttributeKey, TokenTypes.AttributeAssignment])

const ATTRIBUTE_END_TOKENS = new Set([TokenTypes.OpenTagEnd])

export function construct(token: AnyToken, state: ConstructTreeState<ContextualTagNode>) {
  if (ATTRIBUTE_START_TOKENS.has(token.type)) {
    return handleAttributeStart(state, token)
  }

  if (ATTRIBUTE_END_TOKENS.has(token.type)) {
    return handleOpenTagEnd(state)
  }

  state.caretPosition++

  return state
}

function handleAttributeStart(state: ConstructTreeState<ContextualTagNode>, token: AnyToken) {
  initAttributesIfNone(state.currentNode)

  // mew empty attributes
  state.currentNode.attributes.push({
    type: NodeTypes.Attribute,
    range: cloneRange(token.range),
    loc: cloneLocation(token.loc),
  })

  state.currentContext = {
    parentRef: state.currentContext,
    type: ConstructTreeContextTypes.Attribute,
  }

  return state
}

function handleOpenTagEnd(state: ConstructTreeState<ContextualTagNode>) {
  state.currentContext = state.currentContext.parentRef

  return state
}
