import { ConstructTreeContextTypes, TokenTypes } from '../../constants'
import { createNodeFrom, updateNodeEnd } from '../../utils'
import type {
  AnyToken,
  ConstructTreeState,
  ContextualDoctypeNode,
  DoctypeCloseNode,
  DoctypeOpenNode,
} from '../../types'

const ATTRIBUTES_START_TOKENS = new Set([
  TokenTypes.DoctypeAttributeWrapperStart,
  TokenTypes.DoctypeAttributeValue,
])

export function construct(
  token: AnyToken,
  state: ConstructTreeState<ContextualDoctypeNode>,
) {
  if (token.type === TokenTypes.DoctypeOpen) {
    return handleDoctypeOpen(state, token)
  }

  if (token.type === TokenTypes.DoctypeClose) {
    return handleDoctypeClose(state, token)
  }

  if (ATTRIBUTES_START_TOKENS.has(token.type)) {
    return handleDoctypeAttributes(state)
  }

  state.caretPosition++

  return state
}

function handleDoctypeOpen(
  state: ConstructTreeState<ContextualDoctypeNode>,
  token: AnyToken,
) {
  state.currentNode.open = createNodeFrom(token) as DoctypeOpenNode

  state.caretPosition++

  return state
}

function handleDoctypeClose(
  state: ConstructTreeState<ContextualDoctypeNode>,
  token: AnyToken,
) {
  state.currentNode.close = createNodeFrom(token) as DoctypeCloseNode

  updateNodeEnd(state.currentNode, token)

  state.currentNode = state.currentNode.parentRef
  state.currentContext = state.currentContext.parentRef

  state.caretPosition++

  return state
}

function handleDoctypeAttributes(
  state: ConstructTreeState<ContextualDoctypeNode>,
) {
  state.currentContext = {
    parentRef: state.currentContext,
    type: ConstructTreeContextTypes.DoctypeAttributes,
  }

  return state
}
