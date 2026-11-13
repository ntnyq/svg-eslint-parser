import { parseOpenTagName } from '../../syntax/parseOpenTagName'
import { TokenTypes } from '../../tokenizer/tokenTypes'
import { ConstructTreeContextTypes } from '../constructTreeContextTypes'
import { createTokenDispatcher } from '../tokenDispatcher'
import { consume, getParentContext } from '../transitions'

const dispatchToken = createTokenDispatcher(
  ConstructTreeContextTypes.TagName,
  [
    {
      tokenType: TokenTypes.OpenTagStart,
      handler(token, state) {
        state.currentContext.node.name = parseOpenTagName(token.value)
        return consume(state, getParentContext(state))
      },
    },
  ],
  (_, state) => {
    return consume(state)
  },
)

/**
 * Construct the source-preserving name for an element node.
 */
export const construct = dispatchToken
