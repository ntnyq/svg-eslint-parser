import { TokenTypes } from '../../tokenizer/tokenTypes'
import { ConstructTreeContextTypes } from '../constructTreeContextTypes'
import { createTokenDispatcher } from '../tokenDispatcher'
import { consume, createContext } from '../transitions'

const dispatchToken = createTokenDispatcher(
  ConstructTreeContextTypes.XMLDeclaration,
  [
    {
      tokenType: TokenTypes.XMLDeclarationOpen,
      handler(_, state) {
        return consume(
          state,
          createContext(
            ConstructTreeContextTypes.XMLDeclarationAttributes,
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
 * Construct an XML declaration node after its opening token.
 */
export const construct = dispatchToken
