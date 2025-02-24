import { TokenTypes } from '../../constants'
import { parseOpenTagName } from '../../utils'
import type {
  AnyToken,
  ConstructTreeState,
  ContextualTagNode,
  Token,
} from '../../types'

export function construct(
  token: AnyToken,
  state: ConstructTreeState<ContextualTagNode>,
) {
  if (token.type === TokenTypes.OpenTagStart) {
    handleTagOpenStart(state, token)
  }

  state.caretPosition++

  return state
}

function handleTagOpenStart(
  state: ConstructTreeState<ContextualTagNode>,
  token: Token<TokenTypes.OpenTagStart>,
) {
  state.currentNode.name = parseOpenTagName(token.value)

  state.currentContext = state.currentContext.parentRef

  return state
}
