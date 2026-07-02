import { ConstructTreeContextTypes, TokenTypes } from '../../constants'
import { createTokenDispatcher } from '../handlerFactory'
import type {
  AnyToken,
  ConstructTreeState,
  ContextualXMLDeclarationNode,
} from '../../types'

const dispatch = createTokenDispatcher(
  [
    {
      tokenType: TokenTypes.XMLDeclarationOpen,
      handler(_, state) {
        state.currentContext = {
          parentRef: state.currentContext,
          type: ConstructTreeContextTypes.XMLDeclarationAttributes,
        }
        state.caretPosition++
        return state
      },
    },
  ],
  (_, state) => {
    state.caretPosition++
    return state
  },
)

/**
 * Construct an XML declaration node after its opening token.
 */
export function construct(
  token: AnyToken,
  state: ConstructTreeState<ContextualXMLDeclarationNode>,
) {
  return dispatch(token, state)
}
