import { TokenTypes } from '../../tokenizer/tokenTypes'
import { ConstructTreeContextTypes } from '../constructTreeContextTypes'
import { createTokenDispatcher } from '../tokenDispatcher'
import { consume, getParentContext } from '../transitions'
import { updateNodeEnd } from '../updateNodeEnd'

const dispatchToken = createTokenDispatcher(ConstructTreeContextTypes.CDATA, [
  {
    tokenType: TokenTypes.CDATAOpen,
    handler(_, state) {
      return consume(state)
    },
  },
  {
    tokenType: TokenTypes.CDATAContent,
    handler(token, state) {
      state.currentContext.node.value = token.value
      updateNodeEnd(state.currentContext.node, token)
      return consume(state)
    },
  },
  {
    tokenType: TokenTypes.CDATAClose,
    handler(token, state) {
      updateNodeEnd(state.currentContext.node, token)
      return consume(state, getParentContext(state))
    },
  },
])

/**
 * Construct a CDATA node from its delimiter and content tokens.
 */
export const construct = dispatchToken
