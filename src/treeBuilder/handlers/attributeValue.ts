import { NodeTypes } from '../../ast/nodeTypes'
import { cloneLocation } from '../../source/cloneLocation'
import { cloneRange } from '../../source/cloneRange'
import { TokenTypes } from '../../tokenizer/tokenTypes'
import { ConstructTreeContextTypes } from '../constructTreeContextTypes'
import { createNodeFrom } from '../createNodeFrom'
import { getLastAttribute } from '../getLastAttribute'
import { createTokenDispatcher } from '../tokenDispatcher'
import { consume, getParentContext, reprocess } from '../transitions'
import { updateNodeEnd } from '../updateNodeEnd'

const VALUE_END_TOKENS = new Set([
  TokenTypes.OpenTagEnd,
  TokenTypes.AttributeKey,
  TokenTypes.AttributeAssignment,
])

const dispatchToken = createTokenDispatcher(
  ConstructTreeContextTypes.AttributeValue,
  [
    {
      tokenType: VALUE_END_TOKENS,
      handler(_, state) {
        return reprocess(state, getParentContext(state))
      },
    },
    {
      tokenType: TokenTypes.AttributeValue,
      handler(token, state) {
        const attribute = getLastAttribute(state)
        attribute.value = {
          ...createNodeFrom(token),
          type: NodeTypes.AttributeValue,
        }
        updateNodeEnd(attribute, token)
        return consume(state)
      },
    },
    {
      tokenType: TokenTypes.AttributeValueWrapperStart,
      handler(token, state) {
        const attribute = getLastAttribute(state)
        if (token.value !== '"' && token.value !== "'") {
          throw new Error('Expected an attribute quote token.')
        }
        attribute.quoteChar = token.value
        if (!attribute.key) {
          attribute.range = cloneRange(token.range)
          attribute.loc = cloneLocation(token.loc)
        }
        return consume(state)
      },
    },
    {
      tokenType: TokenTypes.AttributeValueWrapperEnd,
      handler(token, state) {
        const attribute = getLastAttribute(state)
        updateNodeEnd(attribute, token)
        return consume(state)
      },
    },
  ],
  (_, state) => {
    return consume(state)
  },
)

/**
 * Construct an element attribute value from value tokens.
 */
export const construct = dispatchToken
