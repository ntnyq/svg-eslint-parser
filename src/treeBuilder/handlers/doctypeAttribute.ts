import { NodeTypes } from '../../ast/nodeTypes'
import { cloneRange } from '../../source/cloneRange'
import { TokenTypes } from '../../tokenizer/tokenTypes'
import { ConstructTreeContextTypes } from '../constructTreeContextTypes'
import { createNodeFrom } from '../createNodeFrom'
import { getLastAttribute } from '../getLastAttribute'
import { createTokenDispatcher } from '../tokenDispatcher'
import { consume, getParentContext, reprocess } from '../transitions'
import { updateNodeEnd } from '../updateNodeEnd'

const ATTRIBUTE_END_TOKENS = new Set([
  TokenTypes.DoctypeClose,
  TokenTypes.DoctypeInternalSubset,
])

const dispatchToken = createTokenDispatcher(
  ConstructTreeContextTypes.DoctypeAttribute,
  [
    {
      tokenType: ATTRIBUTE_END_TOKENS,
      handler(_, state) {
        return reprocess(state, getParentContext(state))
      },
    },
    {
      tokenType: TokenTypes.DoctypeAttributeWrapperStart,
      handler(token, state) {
        const attribute = getLastAttribute(state)
        if (attribute.value !== undefined) {
          return reprocess(state, getParentContext(state))
        }
        if (token.value !== '"' && token.value !== "'") {
          throw new Error('Expected an attribute quote token.')
        }
        attribute.quoteChar = token.value
        attribute.range = cloneRange(token.range)
        return consume(state)
      },
    },
    {
      tokenType: TokenTypes.DoctypeAttributeWrapperEnd,
      handler(token, state) {
        const attribute = getLastAttribute(state)
        updateNodeEnd(attribute, token)
        return consume(state, getParentContext(state))
      },
    },
    {
      tokenType: TokenTypes.DoctypeAttributeValue,
      handler(token, state) {
        const attribute = getLastAttribute(state)
        if (attribute.value !== undefined) {
          return reprocess(state, getParentContext(state))
        }
        attribute.value = {
          ...createNodeFrom(token),
          type: NodeTypes.DoctypeAttributeValue,
        }
        if (!attribute.quoteChar) {
          attribute.range = cloneRange(token.range)
        }
        return consume(state)
      },
    },
  ],
  (_, state) => {
    return consume(state)
  },
)

/**
 * Construct a doctype attribute from value and wrapper tokens.
 */
export const construct = dispatchToken
