import {
  ConstructTreeContextTypes,
  NodeTypes,
  TokenTypes,
} from '../../constants'
import { cloneLocation, cloneRange, initAttributesIfNone } from '../../utils'
import { createTokenDispatcher } from '../handlerFactory'
import type {
  AnyToken,
  ConstructTreeState,
  ContextualTagNode,
} from '../../types'

const ATTRIBUTE_START_TOKENS = new Set([
  TokenTypes.AttributeKey,
  TokenTypes.AttributeAssignment,
])

const ATTRIBUTE_END_TOKENS = new Set([TokenTypes.OpenTagEnd])

const dispatch = createTokenDispatcher(
  [
    {
      tokenType: ATTRIBUTE_START_TOKENS,
      handler: (token, state) => {
        initAttributesIfNone(state.currentNode)
        // new empty attributes
        state.currentNode.attributes.push({
          type: NodeTypes.Attribute,
          range: cloneRange(token.range),
          loc: cloneLocation(token.loc),
        })
        state.currentContext = {
          parentRef: state.currentContext,
          type: ConstructTreeContextTypes.Attribute,
        }
        return state
      },
    },
    {
      tokenType: ATTRIBUTE_END_TOKENS,
      handler: (_, state) => {
        state.currentContext = state.currentContext.parentRef
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
