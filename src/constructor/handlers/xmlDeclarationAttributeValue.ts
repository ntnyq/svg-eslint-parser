import { TokenTypes } from '../../constants'
import {
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

const dispatch = createTokenDispatcher(
  [
    {
      tokenType: TokenTypes.OpenTagEnd,
      handler: (_, state) => {
        state.currentContext = state.currentContext.parentRef
        return state
      },
    },
    {
      tokenType: TokenTypes.AttributeValue,
      handler: (token, state) => {
        const attribute = getLastAttribute(state)
        if (attribute.value !== undefined) {
          state.currentContext = state.currentContext.parentRef
          return state
        }
        attribute.value = createNodeFrom(token) as AttributeValueNode
        if (!attribute.quoteChar) {
          attribute.range = cloneRange(token.range)
        }
        state.caretPosition++
        return state
      },
    },
    {
      tokenType: TokenTypes.AttributeValueWrapperStart,
      handler: (token, state) => {
        const attribute = getLastAttribute(state)
        if (attribute.value !== undefined) {
          state.currentContext = state.currentContext.parentRef
          return state
        }
        attribute.quoteChar = token.value as any
        attribute.range = cloneRange(token.range)
        state.caretPosition++
        return state
      },
    },
    {
      tokenType: TokenTypes.AttributeValueWrapperEnd,
      handler: (token, state) => {
        const attribute = getLastAttribute(state)
        updateNodeEnd(attribute, token)
        state.currentContext = state.currentContext.parentRef
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
