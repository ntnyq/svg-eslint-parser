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
          type: ConstructTreeContextTypes.XMLDeclarationAttribute,
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
  state: ConstructTreeState<ContextualTagNode>,
) {
  return dispatch(token, state)
}
