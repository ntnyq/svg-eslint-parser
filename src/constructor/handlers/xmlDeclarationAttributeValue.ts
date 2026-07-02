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
  ConstructTreeState,
  ContextualXMLDeclarationNode,
  XMLDeclarationAttributeNode,
  XMLDeclarationAttributeValueNode,
} from '../../types'

const dispatch = createTokenDispatcher(
  [
    {
      tokenType: TokenTypes.XMLDeclarationClose,
      handler(_, state) {
        state.currentContext = state.currentContext.parentRef
        return state
      },
    },
    {
      tokenType: TokenTypes.XMLDeclarationAttributeValue,
      handler(token, state) {
        const attribute = getLastAttribute(
          state,
        ) as unknown as XMLDeclarationAttributeNode
        if (attribute.value !== undefined) {
          state.currentContext = state.currentContext.parentRef
          return state
        }
        attribute.value = createNodeFrom(
          token,
        ) as XMLDeclarationAttributeValueNode
        if (!attribute.quoteChar) {
          attribute.range = cloneRange(token.range)
        }
        state.caretPosition++
        return state
      },
    },
    {
      tokenType: TokenTypes.XMLDeclarationAttributeValueWrapperStart,
      handler(token, state) {
        const attribute = getLastAttribute(
          state,
        ) as unknown as XMLDeclarationAttributeNode
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
      tokenType: TokenTypes.XMLDeclarationAttributeValueWrapperEnd,
      handler(token, state) {
        const attribute = getLastAttribute(
          state,
        ) as unknown as XMLDeclarationAttributeNode
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

/**
 * Construct an XML declaration attribute value from value tokens.
 */
export function construct(
  token: AnyToken,
  state: ConstructTreeState<ContextualXMLDeclarationNode>,
) {
  return dispatch(token, state)
}
