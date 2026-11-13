import type { AnyToken } from '../tokenizer/token'
import type { ConstructTreeContextTypes } from './constructTreeContextTypes'
import type { ConstructTreeHandler } from './constructTreeHandler'
import type {
  ConstructTreeContext,
  ConstructTreeState,
} from './constructTreeState'

/**
 * Exhaustive registration used by construction; partial tables are accepted by
 * the driver so missing contexts produce a descriptive invariant failure.
 */
export type ConstructTreeHandlers = {
  [Kind in ConstructTreeContextTypes]: { construct: ConstructTreeHandler<Kind> }
}

/**
 * Run construction handlers until every token is consumed. Reprocessing must
 * change context, may not revisit a frame, and consumption advances by one.
 */
export function processTokens(
  tokens: AnyToken[],
  initialState: ConstructTreeState,
  handlers: Partial<ConstructTreeHandlers>,
): ConstructTreeState {
  let state = initialState
  const visitedContexts = new Set<ConstructTreeContext>()
  while (state.caretPosition < tokens.length) {
    const tokenIndex = state.caretPosition
    const context = state.currentContext
    if (visitedContexts.has(context)) {
      throw new Error(
        `Construction context cycle at token ${tokenIndex} (${context.type}).`,
      )
    }
    visitedContexts.add(context)
    const handler = handlers[context.type]?.construct
    if (!handler) {
      throw new Error(`Missing construction handler for ${context.type}.`)
    }
    const next = handler(tokens[tokenIndex], state)
    const tokenAdvance = next.caretPosition - tokenIndex
    if (tokenAdvance !== 0 && tokenAdvance !== 1) {
      throw new Error(
        `Construction must consume exactly one token or reprocess it (${context.type}).`,
      )
    }
    if (
      tokenAdvance === 0 &&
      next.currentContext.type === context.type &&
      next.currentContext.node === context.node
    ) {
      throw new Error(
        `Construction made no progress at token ${tokenIndex} (${context.type}).`,
      )
    }
    if (tokenAdvance === 1) {
      visitedContexts.clear()
    }
    state = next
  }
  return state
}
