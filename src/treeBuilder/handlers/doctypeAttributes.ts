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
  TokenTypes.DoctypeAttributeWrapperStart,
  TokenTypes.DoctypeAttributeValue,
])

const dispatchToken = createTokenDispatcher(
  ConstructTreeContextTypes.DoctypeAttributes,
  [
    {
      tokenType: TokenTypes.DoctypeInternalSubset,
      handler(_, state) {
        return reprocess(state, getParentContext(state))
      },
    },
    {
      tokenType: TokenTypes.DoctypeClose,
      handler(_, state) {
        return reprocess(state, getParentContext(state))
      },
    },
    {
      tokenType: ATTRIBUTE_START_TOKENS,
      handler(token, state) {
        initAttributesIfNone(state.currentContext.node)
        // new empty attributes
        state.currentContext.node.attributes.push({
          type: NodeTypes.DoctypeAttribute,
          range: cloneRange(token.range),
          loc: cloneLocation(token.loc),
        })
        return reprocess(
          state,
          createContext(
            ConstructTreeContextTypes.DoctypeAttribute,
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
 * Construct the attributes collection for a doctype node.
 */
export const construct = dispatchToken
