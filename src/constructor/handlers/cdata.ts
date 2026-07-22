import { TokenTypes } from '../../constants'
import { updateNodeEnd } from '../../utils'
import { createTokenDispatcher } from '../handlerFactory'
import type {
  AnyToken,
  ConstructTreeState,
  ContextualCDATANode,
} from '../../types'

const dispatch = createTokenDispatcher([
  {
    tokenType: TokenTypes.CDATAOpen,
    handler(_, state) {
      state.caretPosition++
      return state
    },
  },
  {
    tokenType: TokenTypes.CDATAContent,
    handler(token, state) {
      state.currentNode.value = token.value
      updateNodeEnd(state.currentNode, token)
      state.caretPosition++
      return state
    },
  },
  {
    tokenType: TokenTypes.CDATAClose,
    handler(token, state) {
      updateNodeEnd(state.currentNode, token)
      state.currentNode = state.currentNode.parentRef
      state.currentContext = state.currentContext.parentRef
      state.caretPosition++
      return state
    },
  },
])

/**
 * Construct a CDATA node from its delimiter and content tokens.
 */
export function construct(
  token: AnyToken,
  state: ConstructTreeState<ContextualCDATANode>,
) {
  return dispatch(token, state)
}
