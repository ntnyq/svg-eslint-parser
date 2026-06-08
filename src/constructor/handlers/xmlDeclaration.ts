import { TokenTypes } from '../../constants'
import type {
  AnyToken,
  ConstructTreeState,
  ContextualElementNode,
} from '../../types'
import { parseOpenTagName } from '../../utils'
import { createTokenDispatcher } from '../handlerFactory'

const dispatch = createTokenDispatcher(
  [
    {
      tokenType: TokenTypes.OpenTagStart,
      handler(token, state) {
        state.currentNode.name = parseOpenTagName(token.value)
        state.currentContext = state.currentContext.parentRef
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

export function construct(
  token: AnyToken,
  state: ConstructTreeState<ContextualElementNode>,
) {
  return dispatch(token, state)
}
