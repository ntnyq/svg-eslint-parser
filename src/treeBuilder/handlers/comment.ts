import { TokenTypes } from '../../tokenizer/tokenTypes'
import { ConstructTreeContextTypes } from '../constructTreeContextTypes'
import { createTokenDispatcher } from '../tokenDispatcher'
import { consume, getParentContext } from '../transitions'
import { updateNodeEnd } from '../updateNodeEnd'

const dispatchToken = createTokenDispatcher(ConstructTreeContextTypes.Comment, [
  {
    tokenType: TokenTypes.CommentOpen,
    handler(_, state) {
      return consume(state)
    },
  },
  {
    tokenType: TokenTypes.CommentContent,
    handler(token, state) {
      state.currentContext.node.content = token.value
      state.currentContext.node.value = token.value
      updateNodeEnd(state.currentContext.node, token)
      return consume(state)
    },
  },
  {
    tokenType: TokenTypes.CommentClose,
    handler(token, state) {
      updateNodeEnd(state.currentContext.node, token)
      return consume(state, getParentContext(state))
    },
  },
])

/**
 * Construct a comment node from comment tokens.
 */
export const construct = dispatchToken
