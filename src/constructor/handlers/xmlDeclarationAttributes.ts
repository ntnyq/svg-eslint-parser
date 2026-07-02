import {
  ConstructTreeContextTypes,
  NodeTypes,
  TokenTypes,
} from '../../constants'
import {
  cloneLocation,
  cloneRange,
  initAttributesIfNone,
  updateNodeEnd,
} from '../../utils'
import { createTokenDispatcher } from '../handlerFactory'
import type {
  AnyToken,
  ConstructTreeState,
  ContextualXMLDeclarationNode,
} from '../../types'

const ATTRIBUTE_START_TOKENS = new Set([
  TokenTypes.XMLDeclarationAttributeKey,
  TokenTypes.XMLDeclarationAttributeAssignment,
])

const dispatch = createTokenDispatcher(
  [
    {
      tokenType: TokenTypes.XMLDeclarationClose,
      handler(token, state) {
        updateNodeEnd(state.currentNode, token)
        state.currentNode = state.currentNode.parentRef
        state.currentContext = state.currentContext.parentRef
        state.caretPosition++
        return state
      },
    },
    {
      tokenType: ATTRIBUTE_START_TOKENS,
      handler(token, state) {
        initAttributesIfNone(state.currentNode)
        // new empty attributes
        state.currentNode.attributes.push({
          type: NodeTypes.XMLDeclarationAttribute,
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

/**
 * Construct the attributes collection for an XML declaration node.
 */
export function construct(
  token: AnyToken,
  state: ConstructTreeState<ContextualXMLDeclarationNode>,
) {
  return dispatch(token, state)
}
