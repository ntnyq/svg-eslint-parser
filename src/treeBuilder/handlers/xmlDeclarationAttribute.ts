import { NodeTypes } from '../../ast/nodeTypes'
import { TokenTypes } from '../../tokenizer/tokenTypes'
import { ConstructTreeContextTypes } from '../constructTreeContextTypes'
import { createNodeFrom } from '../createNodeFrom'
import { getLastAttribute } from '../getLastAttribute'
import { createTokenDispatcher } from '../tokenDispatcher'
import {
  consume,
  createContext,
  getParentContext,
  reprocess,
} from '../transitions'

const VALUE_END_TOKENS = new Set([TokenTypes.XMLDeclarationClose])

const dispatchToken = createTokenDispatcher(
  ConstructTreeContextTypes.XMLDeclarationAttribute,
  [
    {
      tokenType: VALUE_END_TOKENS,
      handler(_, state) {
        return reprocess(state, getParentContext(state))
      },
    },
    {
      tokenType: TokenTypes.XMLDeclarationAttributeKey,
      handler(token, state) {
        const attribute = getLastAttribute(state)

        if (attribute.key !== undefined || attribute.value !== undefined) {
          return reprocess(state, getParentContext(state))
        }

        attribute.key = {
          ...createNodeFrom(token),
          type: NodeTypes.XMLDeclarationAttributeKey,
        }
        return consume(state)
      },
    },
    {
      tokenType: TokenTypes.XMLDeclarationAttributeAssignment,
      handler(_, state) {
        const attribute = getLastAttribute(state)

        if (attribute.value !== undefined) {
          return reprocess(state, getParentContext(state))
        }

        return consume(
          state,
          createContext(
            ConstructTreeContextTypes.XMLDeclarationAttributeValue,
            state.currentContext.node,
            state.currentContext,
          ),
        )
      },
    },
  ],
  (_, state) => {
    return consume(state)
  },
)

/**
 * Construct an XML declaration attribute key and value transition.
 */
export const construct = dispatchToken
