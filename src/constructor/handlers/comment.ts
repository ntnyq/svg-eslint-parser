import { TokenTypes } from '../../constants'
import { createNodeFrom, updateNodeEnd } from '../../utils'
import type {
  AnyToken,
  CommentCloseNode,
  CommentContentNode,
  CommentOpenNode,
  ConstructTreeState,
  ContextualCommentNode,
} from '../../types'

export function construct(
  token: AnyToken,
  state: ConstructTreeState<ContextualCommentNode>,
) {
  if (token.type === TokenTypes.CommentOpen) {
    return handleCommentOpen(state, token)
  }

  if (token.type === TokenTypes.CommentContent) {
    return handleCommentContent(state, token)
  }

  if (token.type === TokenTypes.CommentClose) {
    return handleCommentClose(state, token)
  }

  return state
}

function handleCommentOpen(
  state: ConstructTreeState<ContextualCommentNode>,
  token: AnyToken,
) {
  state.currentNode.open = createNodeFrom(token) as CommentOpenNode

  state.caretPosition++

  return state
}

function handleCommentContent(
  state: ConstructTreeState<ContextualCommentNode>,
  token: AnyToken,
) {
  state.currentNode.value = createNodeFrom(token) as CommentContentNode

  state.caretPosition++

  return state
}

function handleCommentClose(
  state: ConstructTreeState<ContextualCommentNode>,
  token: AnyToken,
) {
  state.currentNode.close = createNodeFrom(token) as CommentCloseNode

  updateNodeEnd(state.currentNode, token)

  state.currentNode = state.currentNode.parentRef
  state.currentContext = state.currentContext.parentRef
  state.caretPosition++

  return state
}
