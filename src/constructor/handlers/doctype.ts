import { ConstructTreeContextTypes, TokenTypes } from '../../constants'
import { createNodeFrom, updateNodeEnd } from '../../utils'
import { createTokenDispatcher } from '../handlerFactory'
import type {
  AnyToken,
  ConstructTreeState,
  ContextualDoctypeNode,
} from '../../types'

const ATTRIBUTES_START_TOKENS = new Set([
  TokenTypes.DoctypeAttributeWrapperStart,
  TokenTypes.DoctypeAttributeValue,
])

const dispatch = createTokenDispatcher(
  [
    {
      tokenType: TokenTypes.DoctypeOpen,
      handler(token, state) {
        state.currentNode.open = createNodeFrom(token)
        state.caretPosition++
        return state
      },
    },
    {
      tokenType: TokenTypes.DoctypeClose,
      handler(token, state) {
        state.currentNode.close = createNodeFrom(token)
        updateNodeEnd(state.currentNode, token)
        state.currentNode = state.currentNode.parentRef
        state.currentContext = state.currentContext.parentRef
        state.caretPosition++
        return state
      },
    },
    {
      tokenType: ATTRIBUTES_START_TOKENS,
      handler(_, state) {
        state.currentContext = {
          parentRef: state.currentContext,
          type: ConstructTreeContextTypes.DoctypeAttributes,
        }
        return state
      },
    },
  ],
  (_, state) => {
    state.caretPosition++
    return state
  },
)

export function construct(
  token: AnyToken,
  state: ConstructTreeState<ContextualDoctypeNode>,
) {
  return dispatch(token, state)
}
