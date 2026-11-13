import { NodeTypes } from '../../ast/nodeTypes'
import { cloneLocation } from '../../source/cloneLocation'
import { cloneRange } from '../../source/cloneRange'
import { TokenTypes } from '../../tokenizer/tokenTypes'
import { ConstructTreeContextTypes } from '../constructTreeContextTypes'
import { initAttributesIfNone } from '../initIfNone'
import { createTokenDispatcher } from '../tokenDispatcher'
import {
  consume,
  createContext,
  getParentContext,
  reprocess,
} from '../transitions'

const ATTRIBUTE_START_TOKENS = new Set([
  TokenTypes.AttributeKey,
  TokenTypes.AttributeAssignment,
])

const ATTRIBUTE_END_TOKENS = new Set([TokenTypes.OpenTagEnd])

const dispatchToken = createTokenDispatcher(
  ConstructTreeContextTypes.Attributes,
  [
    {
      tokenType: ATTRIBUTE_START_TOKENS,
      handler(token, state) {
        initAttributesIfNone(state.currentContext.node)
        // new empty attributes
        state.currentContext.node.attributes.push({
          type: NodeTypes.Attribute,
          range: cloneRange(token.range),
          loc: cloneLocation(token.loc),
        })
        return reprocess(
          state,
          createContext(
            ConstructTreeContextTypes.Attribute,
            state.currentContext.node,
            state.currentContext,
          ),
        )
      },
    },
    {
      tokenType: ATTRIBUTE_END_TOKENS,
      handler(_, state) {
        return reprocess(state, getParentContext(state))
      },
    },
  ],
  (_, state) => {
    return consume(state)
  },
)

/**
 * Construct the attributes collection for an element node.
 */
export const construct = dispatchToken
