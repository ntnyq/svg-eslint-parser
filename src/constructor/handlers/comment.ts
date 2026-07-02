import { TokenTypes } from '../../constants'
import { updateNodeEnd } from '../../utils'
import { createTokenDispatcher } from '../handlerFactory'
import type {
  AnyToken,
  ConstructTreeState,
  ContextualCommentNode,
} from '../../types'

const dispatch = createTokenDispatcher([
  {
    tokenType: TokenTypes.CommentOpen,
    handler(_, state) {
      state.caretPosition++
      return state
    },
  },
  {
    tokenType: TokenTypes.CommentContent,
    handler(token, state) {
      state.currentNode.content = token.value
      state.caretPosition++
      return state
    },
  },
  {
    tokenType: TokenTypes.CommentClose,
    handler(token, state) {
      updateNodeEnd(state.currentNode, token)
      state.currentNode = state.currentNode.parentRef
      state.currentContext = state.currentContext.parentRef
      state.caretPosition++
      return state
    },
  },
])

export function construct(
  token: AnyToken,
  state: ConstructTreeState<ContextualCommentNode>,
) {
  return dispatch(token, state)
}
