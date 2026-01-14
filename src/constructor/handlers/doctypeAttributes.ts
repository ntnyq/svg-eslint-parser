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
  ContextualDoctypeNode,
} from '../../types'

const ATTRIBUTE_START_TOKENS = new Set([
  TokenTypes.DoctypeAttributeWrapperStart,
  TokenTypes.DoctypeAttributeValue,
])

const dispatch = createTokenDispatcher(
  [
    {
      tokenType: TokenTypes.DoctypeClose,
      handler: (_, state) => {
        state.currentContext = state.currentContext.parentRef
        return state
      },
    },
    {
      tokenType: ATTRIBUTE_START_TOKENS,
      handler: (token, state) => {
        initAttributesIfNone(state.currentNode)
        // mew empty attributes
        state.currentNode.attributes.push({
          type: NodeTypes.DoctypeAttribute,
          range: cloneRange(token.range),
          loc: cloneLocation(token.loc),
        })
        state.currentContext = {
          type: ConstructTreeContextTypes.DoctypeAttribute,
          parentRef: state.currentContext,
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
