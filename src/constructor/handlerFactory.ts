/**
 * Handler Factory and Utilities
 * Provides a unified way to dispatch tokens to handlers
 */

import type { TokenTypes } from '../constants'
import type { AnyContextualNode, AnyToken, ConstructTreeState } from '../types'

/**
 * Handler function type
 */
export type HandlerFunction<ContextualNode extends AnyContextualNode = any> = (
  token: AnyToken,
  state: ConstructTreeState<ContextualNode>,
) => ConstructTreeState<ContextualNode>

/**
 * Handler configuration
 */
export interface HandlerConfig<ContextualNode extends AnyContextualNode = any> {
  tokenType: TokenTypes | Set<TokenTypes>
  handler: HandlerFunction<ContextualNode>
}

/**
 * Creates a dispatch function from handler configurations
 * @param handlers - Array of handler configurations
 * @param defaultHandler - Optional default handler for unmatched tokens
 * @returns A function that dispatches tokens to appropriate handlers
 */

export function createTokenDispatcher<
  ContextualNode extends AnyContextualNode = any,
>(
  handlers: HandlerConfig<ContextualNode>[],
  defaultHandler?: HandlerFunction<ContextualNode>,
) {
  return (token: AnyToken, state: ConstructTreeState<ContextualNode>) => {
    for (const config of handlers) {
      const matches =
        config.tokenType instanceof Set
          ? config.tokenType.has(token.type as any)
          : config.tokenType === token.type

      if (matches) {
        return config.handler(token, state)
      }
    }

    // Use default handler or return state unchanged
    if (defaultHandler) {
      return defaultHandler(token, state)
    }

    return state
  }
}

/**
 * Creates a simple handler that just increments caretPosition
 */
export function createSkipHandler<
  ContextualNode extends AnyContextualNode,
>(): HandlerFunction<ContextualNode> {
  return (_token: AnyToken, state: ConstructTreeState<ContextualNode>) => {
    state.caretPosition++
    return state
  }
}

/**
 * Creates a handler that increments caretPosition after calling a function
 */
export function createIncrementingHandler<
  ContextualNode extends AnyContextualNode,
>(
  fn: (token: AnyToken, state: ConstructTreeState<ContextualNode>) => void,
): HandlerFunction<ContextualNode> {
  return (token: AnyToken, state: ConstructTreeState<ContextualNode>) => {
    fn(token, state)
    state.caretPosition++
    return state
  }
}
