import { ConstructTreeContextTypes, TokenTypes } from '../../constants'
import { createNodeFrom, getLastAttribute } from '../../utils'
import { createTokenDispatcher } from '../handlerFactory'
import type {
  AnyToken,
  ConstructTreeState,
  ContextualXMLDeclarationNode,
  XMLDeclarationAttributeKeyNode,
  XMLDeclarationAttributeNode,
} from '../../types'

const VALUE_END_TOKENS = new Set([TokenTypes.XMLDeclarationClose])

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
      tokenType: TokenTypes.XMLDeclarationAttributeKey,
      handler(token, state) {
        const attribute = getLastAttribute(
          state,
        ) as unknown as XMLDeclarationAttributeNode

        if (attribute.key !== undefined || attribute.value !== undefined) {
          state.currentContext = state.currentContext.parentRef
          return state
        }

        attribute.key = createNodeFrom(token) as XMLDeclarationAttributeKeyNode
        state.caretPosition++
        return state
      },
    },
    {
      tokenType: TokenTypes.XMLDeclarationAttributeAssignment,
      handler(_, state) {
        const attribute = getLastAttribute(
          state,
        ) as unknown as XMLDeclarationAttributeNode

        if (attribute.value !== undefined) {
          state.currentContext = state.currentContext.parentRef
          return state
        }

        state.currentContext = {
          parentRef: state.currentContext,
          type: ConstructTreeContextTypes.XMLDeclarationAttributeValue,
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

/**
 * Construct an XML declaration attribute key and value transition.
 */
export function construct(
  token: AnyToken,
  state: ConstructTreeState<ContextualXMLDeclarationNode>,
) {
  return dispatch(token, state)
}
