/**
 * Handler Factory and Utilities
 * Provides a unified way to dispatch tokens to handlers
 */

import type { TokenTypes } from '../constants'
import type { AnyToken } from '../types'

/**
 * Handler function type
 */
export type HandlerFunction = (token: AnyToken, state: any) => any

/**
 * Handler configuration
 */
export interface HandlerConfig {
  tokenType: TokenTypes | Set<TokenTypes>
  handler: HandlerFunction
}

/**
 * Creates a dispatch function from handler configurations
 * @param handlers - Array of handler configurations
 * @param defaultHandler - Optional default handler for unmatched tokens
 * @returns A function that dispatches tokens to appropriate handlers
 */
export function createTokenDispatcher(
  handlers: HandlerConfig[],
  defaultHandler?: HandlerFunction,
) {
  return (token: AnyToken, state: any) => {
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
export function createSkipHandler(): HandlerFunction {
  return (_token: AnyToken, state: any) => {
    state.caretPosition++
    return state
  }
}

/**
 * Creates a handler that increments caretPosition after calling a function
 */
export function createIncrementingHandler(
  fn: (token: AnyToken, state: any) => void,
): HandlerFunction {
  return (token: AnyToken, state: any) => {
    fn(token, state)
    state.caretPosition++
    return state
  }
}
