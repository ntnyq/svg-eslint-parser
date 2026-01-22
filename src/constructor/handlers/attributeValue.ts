import { TokenTypes } from '../../constants'
import {
  cloneLocation,
  cloneRange,
  createNodeFrom,
  getLastAttribute,
  updateNodeEnd,
} from '../../utils'
import { createTokenDispatcher } from '../handlerFactory'
import type {
  AnyToken,
  AttributeValueNode,
  ConstructTreeState,
  ContextualTagNode,
} from '../../types'

const VALUE_END_TOKENS = new Set([
  TokenTypes.OpenTagEnd,
  TokenTypes.AttributeKey,
  TokenTypes.AttributeAssignment,
])

const dispatch = createTokenDispatcher(
  [
    {
      tokenType: VALUE_END_TOKENS,
      handler(_, state) {
        state.currentContext = state.currentContext.parentRef
        return state
      },
    },
    {
      tokenType: TokenTypes.AttributeValue,
      handler(token, state) {
        const attribute = getLastAttribute(state)
        attribute.value = createNodeFrom(token) as AttributeValueNode
        updateNodeEnd(attribute, token)
        state.caretPosition++
        return state
      },
    },
    {
      tokenType: TokenTypes.AttributeValueWrapperStart,
      handler(token, state) {
        const attribute = getLastAttribute(state)
        attribute.quoteChar = token.value as any
        if (!attribute.key) {
          attribute.range = cloneRange(token.range)
          attribute.loc = cloneLocation(token.loc)
        }
        state.caretPosition++
        return state
      },
    },
    {
      tokenType: TokenTypes.AttributeValueWrapperEnd,
      handler(token, state) {
        const attribute = getLastAttribute(state)
        updateNodeEnd(attribute, token)
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
