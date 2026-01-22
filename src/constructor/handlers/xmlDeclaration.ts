import { TokenTypes } from '../../constants'
import { parseOpenTagName } from '../../utils'
import { createTokenDispatcher } from '../handlerFactory'
import type {
  AnyToken,
  ConstructTreeState,
  ContextualTagNode,
} from '../../types'

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
  state: ConstructTreeState<ContextualTagNode>,
) {
  return dispatch(token, state)
}
