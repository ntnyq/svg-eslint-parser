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

const OPEN_TAG_END_TOKENS = new Set([TokenTypes.OpenTagEnd])

const dispatchToken = createTokenDispatcher(
  ConstructTreeContextTypes.Attribute,
  [
    {
      tokenType: OPEN_TAG_END_TOKENS,
      handler(_, state) {
        return reprocess(state, getParentContext(state))
      },
    },
    {
      tokenType: TokenTypes.AttributeKey,
      handler(token, state) {
        const attribute = getLastAttribute(state)

        if (attribute.key !== undefined || attribute.value !== undefined) {
          return reprocess(state, getParentContext(state))
        }

        attribute.key = {
          ...createNodeFrom(token),
          type: NodeTypes.AttributeKey,
        }
        return consume(state)
      },
    },
    {
      tokenType: TokenTypes.AttributeAssignment,
      handler(_, state) {
        const attribute = getLastAttribute(state)

        if (attribute.value !== undefined) {
          return reprocess(state, getParentContext(state))
        }

        return consume(
          state,
          createContext(
            ConstructTreeContextTypes.AttributeValue,
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
 * Construct an element attribute from attribute tokens.
 */
export const construct = dispatchToken
