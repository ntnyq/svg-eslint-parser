import {
  ConstructTreeContextTypes,
  SELF_CLOSING_ELEMENTS,
  TokenTypes,
} from '../../constants'
import { createNodeFrom, updateNodeEnd } from '../../utils'
import { createTokenDispatcher } from '../handlerFactory'
import type {
  AnyToken,
  CloseTagNode,
  ConstructTreeState,
  ContextualTagNode,
  OpenTagEndNode,
  OpenTagStartNode,
} from '../../types'

const ATTRIBUTE_START_TOKENS = new Set([
  TokenTypes.AttributeKey,
  TokenTypes.AttributeAssignment,
])

const dispatch = createTokenDispatcher(
  [
    {
      tokenType: TokenTypes.OpenTagStart,
      handler: (token, state) => {
        state.currentNode.openStart = createNodeFrom(token) as OpenTagStartNode
        state.currentContext = {
          parentRef: state.currentContext,
          type: ConstructTreeContextTypes.TagName,
        }
        return state
      },
    },
    {
      tokenType: ATTRIBUTE_START_TOKENS,
      handler: (_, state) => {
        state.currentContext = {
          parentRef: state.currentContext,
          type: ConstructTreeContextTypes.Attributes,
        }
        return state
      },
    },
    {
      tokenType: TokenTypes.OpenTagEnd,
      handler: (token, state) => {
        const tagName = state.currentNode.name
        state.currentNode.openEnd = createNodeFrom(token) as OpenTagEndNode
        updateNodeEnd(state.currentNode, token)

        if (
          tagName
          && SELF_CLOSING_ELEMENTS.has(tagName)
          && state.currentNode.openEnd.value === '/>'
        ) {
          state.currentNode.selfClosing = true
          state.currentNode = state.currentNode.parentRef
          state.currentContext = state.currentContext.parentRef
          state.caretPosition++
          return state
        }

        state.currentNode.selfClosing = false
        state.currentContext = {
          parentRef: state.currentContext,
          type: ConstructTreeContextTypes.TagContent,
        }
        state.caretPosition++
        return state
      },
    },
    {
      tokenType: TokenTypes.CloseTag,
      handler: (token, state) => {
        state.currentNode.close = createNodeFrom(token) as CloseTagNode
        updateNodeEnd(state.currentNode, token)
        state.currentNode = state.currentNode.parentRef
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
