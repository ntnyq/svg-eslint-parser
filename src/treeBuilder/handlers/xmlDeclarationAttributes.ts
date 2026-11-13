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
import { updateNodeEnd } from '../updateNodeEnd'

const ATTRIBUTE_START_TOKENS = new Set([
  TokenTypes.XMLDeclarationAttributeKey,
  TokenTypes.XMLDeclarationAttributeAssignment,
])

const dispatchToken = createTokenDispatcher(
  ConstructTreeContextTypes.XMLDeclarationAttributes,
  [
    {
      tokenType: TokenTypes.XMLDeclarationClose,
      handler(token, state) {
        updateNodeEnd(state.currentContext.node, token)
        return consume(state, getParentContext(state, 2))
      },
    },
    {
      tokenType: ATTRIBUTE_START_TOKENS,
      handler(token, state) {
        initAttributesIfNone(state.currentContext.node)
        // new empty attributes
        state.currentContext.node.attributes.push({
          type: NodeTypes.XMLDeclarationAttribute,
          range: cloneRange(token.range),
          loc: cloneLocation(token.loc),
        })
        return reprocess(
          state,
          createContext(
            ConstructTreeContextTypes.XMLDeclarationAttribute,
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
 * Construct the attributes collection for an XML declaration node.
 */
export const construct = dispatchToken
