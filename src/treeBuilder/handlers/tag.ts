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

const ATTRIBUTE_START_TOKENS = new Set([
  TokenTypes.AttributeKey,
  TokenTypes.AttributeAssignment,
])

const dispatchToken = createTokenDispatcher(
  ConstructTreeContextTypes.Tag,
  [
    {
      tokenType: TokenTypes.OpenTagStart,
      handler(token, state) {
        state.currentContext.node.openStart = {
          ...createNodeFrom(token),
          type: TokenTypes.OpenTagStart,
        }
        return reprocess(
          state,
          createContext(
            ConstructTreeContextTypes.TagName,
            state.currentContext.node,
            state.currentContext,
          ),
        )
      },
    },
    {
      tokenType: ATTRIBUTE_START_TOKENS,
      handler(_, state) {
        return reprocess(
          state,
          createContext(
            ConstructTreeContextTypes.Attributes,
            state.currentContext.node,
            state.currentContext,
          ),
        )
      },
    },
    {
      tokenType: TokenTypes.OpenTagEnd,
      handler(token, state) {
        const tagName = state.currentContext.node.name
        state.currentContext.node.openEnd = {
          ...createNodeFrom(token),
          type: TokenTypes.OpenTagEnd,
        }
        updateNodeEnd(state.currentContext.node, token)

        if (tagName && state.currentContext.node.openEnd.value === '/>') {
          state.currentContext.node.selfClosing = true
          return consume(state, getParentContext(state))
        }

        state.currentContext.node.selfClosing = false
        return consume(
          state,
          createContext(
            ConstructTreeContextTypes.TagContent,
            state.currentContext.node,
            state.currentContext,
          ),
        )
      },
    },
    {
      tokenType: TokenTypes.CloseTag,
      handler(token, state) {
        state.currentContext.node.close = {
          ...createNodeFrom(token),
          type: TokenTypes.CloseTag,
        }
        updateNodeEnd(state.currentContext.node, token)
        return consume(state, getParentContext(state))
      },
    },
  ],
  (_, state) => {
    return consume(state)
  },
)

/**
 * Construct an element node after its opening tag has started.
 */
export const construct = dispatchToken
