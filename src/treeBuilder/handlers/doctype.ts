import { TokenTypes } from '../../tokenizer/tokenTypes'
import { ConstructTreeContextTypes } from '../constructTreeContextTypes'
import { createNodeFrom } from '../createNodeFrom'
import { createTokenDispatcher } from '../tokenDispatcher'
import {
  consume,
  createContext,
  getParentContext,
  reprocess,
} from '../transitions'
import { updateNodeEnd } from '../updateNodeEnd'

const ATTRIBUTES_START_TOKENS = new Set([
  TokenTypes.DoctypeAttributeWrapperStart,
  TokenTypes.DoctypeAttributeValue,
])

const dispatchToken = createTokenDispatcher(
  ConstructTreeContextTypes.Doctype,
  [
    {
      tokenType: TokenTypes.DoctypeOpen,
      handler(token, state) {
        state.currentContext.node.open = {
          ...createNodeFrom(token),
          type: TokenTypes.DoctypeOpen,
        }
        return consume(state)
      },
    },
    {
      tokenType: TokenTypes.DoctypeInternalSubset,
      handler(token, state) {
        state.currentContext.node.internalSubset = token.value
        updateNodeEnd(state.currentContext.node, token)
        return consume(state)
      },
    },
    {
      tokenType: TokenTypes.DoctypeClose,
      handler(token, state) {
        state.currentContext.node.close = {
          ...createNodeFrom(token),
          type: TokenTypes.DoctypeClose,
        }
        updateNodeEnd(state.currentContext.node, token)
        return consume(state, getParentContext(state))
      },
    },
    {
      tokenType: ATTRIBUTES_START_TOKENS,
      handler(_, state) {
        return reprocess(
          state,
          createContext(
            ConstructTreeContextTypes.DoctypeAttributes,
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
 * Construct a doctype node from doctype tokens.
 */
export const construct = dispatchToken
