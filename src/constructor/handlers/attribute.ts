import { ConstructTreeContextTypes, TokenTypes } from '../../constants'
import { createNodeFrom, getLastAttribute } from '../../utils'
import { createTokenDispatcher } from '../handlerFactory'
import type {
  AnyToken,
  AttributeKeyNode,
  ConstructTreeState,
  ContextualTagNode,
} from '../../types'

const OPEN_TAG_END_TOKENS = new Set([TokenTypes.OpenTagEnd])

const dispatch = createTokenDispatcher(
  [
    {
      tokenType: OPEN_TAG_END_TOKENS,
      handler: (_, state) => {
        state.currentContext = state.currentContext.parentRef
        return state
      },
    },
    {
      tokenType: TokenTypes.AttributeKey,
      handler: (token, state) => {
        const attribute = getLastAttribute(state)

        if (attribute.key !== undefined || attribute.value !== undefined) {
          state.currentContext = state.currentContext.parentRef
          return state
        }

        attribute.key = createNodeFrom(token) as AttributeKeyNode
        state.caretPosition++
        return state
      },
    },
    {
      tokenType: TokenTypes.AttributeAssignment,
      handler: (_, state) => {
        const attribute = getLastAttribute(state)

        if (attribute.value !== undefined) {
          state.currentContext = state.currentContext.parentRef
          return state
        }

        state.currentContext = {
          parentRef: state.currentContext,
          type: ConstructTreeContextTypes.AttributeValue,
        }
        state.caretPosition++
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
  state: ConstructTreeState<ContextualTagNode>,
) {
  return dispatch(token, state)
}
