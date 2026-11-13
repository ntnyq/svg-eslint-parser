import { NodeTypes } from '../../ast/nodeTypes'
import { TokenTypes } from '../../tokenizer/tokenTypes'
import { ConstructTreeContextTypes } from '../constructTreeContextTypes'
import { createNodeFrom } from '../createNodeFrom'
import { getLastAttribute } from '../getLastAttribute'
import { createTokenDispatcher } from '../tokenDispatcher'
import { consume, getParentContext, reprocess } from '../transitions'
import { updateNodeEnd } from '../updateNodeEnd'

const dispatchToken = createTokenDispatcher(
  ConstructTreeContextTypes.XMLDeclarationAttributeValue,
  [
    {
      tokenType: TokenTypes.XMLDeclarationClose,
      handler(_, state) {
        return reprocess(state, getParentContext(state))
      },
    },
    {
      tokenType: TokenTypes.XMLDeclarationAttributeValue,
      handler(token, state) {
        const attribute = getLastAttribute(state)
        if (attribute.value !== undefined) {
          return reprocess(state, getParentContext(state))
        }
        attribute.value = {
          ...createNodeFrom(token),
          type: NodeTypes.XMLDeclarationAttributeValue,
        }
        updateNodeEnd(attribute, token)
        return consume(state)
      },
    },
    {
      tokenType: TokenTypes.XMLDeclarationAttributeValueWrapperStart,
      handler(token, state) {
        const attribute = getLastAttribute(state)
        if (attribute.value !== undefined) {
          return reprocess(state, getParentContext(state))
        }
        if (token.value !== '"' && token.value !== "'") {
          throw new Error('Expected an attribute quote token.')
        }
        attribute.quoteChar = token.value
        updateNodeEnd(attribute, token)
        return consume(state)
      },
    },
    {
      tokenType: TokenTypes.XMLDeclarationAttributeValueWrapperEnd,
      handler(token, state) {
        const attribute = getLastAttribute(state)
        updateNodeEnd(attribute, token)
        return consume(state, getParentContext(state))
      },
    },
  ],
  (_, state) => {
    return consume(state)
  },
)

/**
 * Construct an XML declaration attribute value from value tokens.
 */
export const construct = dispatchToken
