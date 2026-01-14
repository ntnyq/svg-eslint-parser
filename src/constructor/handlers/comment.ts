import { TokenTypes } from '../../constants'
import { updateNodeEnd } from '../../utils'
import type {
  AnyToken,
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
  _token: AnyToken,
) {
  state.caretPosition++
  return state
}

function handleCommentContent(
  state: ConstructTreeState<ContextualCommentNode>,
  token: AnyToken,
) {
  state.currentNode.content = token.value

  state.caretPosition++

  return state
}

function handleCommentClose(
  state: ConstructTreeState<ContextualCommentNode>,
  token: AnyToken,
) {
  updateNodeEnd(state.currentNode, token)

  state.currentNode = state.currentNode.parentRef
  state.currentContext = state.currentContext.parentRef
  state.caretPosition++

  return state
}
