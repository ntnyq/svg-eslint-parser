import { consume } from './transitions'
import type { AnyToken } from '../tokenizer/token'
import type { TokenTypes } from '../tokenizer/tokenTypes'
import type { ConstructTreeContextTypes } from './constructTreeContextTypes'
import type { ConstructTreeHandler } from './constructTreeHandler'
import type { ConstructTreeState } from './constructTreeState'

/**
 * Handler callback with a node narrowed by its registered context.
 */
export type TokenHandler<Kind extends ConstructTreeContextTypes> = (
  token: AnyToken,
  state: ConstructTreeState<Kind>,
) => ConstructTreeState

/**
 * Token cases within a single construction context.
 */
export interface TokenHandlerConfig<Kind extends ConstructTreeContextTypes> {
  tokenType: TokenTypes | ReadonlySet<TokenTypes>
  handler: TokenHandler<Kind>
}

/**
 * Bind token handlers to one context, validating the dispatch boundary before
 * exposing its node to callbacks. Unhandled tokens must have an explicit fallback.
 */
export function createTokenDispatcher<Kind extends ConstructTreeContextTypes>(
  contextType: Kind,
  tokenHandlers: TokenHandlerConfig<Kind>[],
  fallbackHandler?: TokenHandler<Kind>,
): ConstructTreeHandler<Kind> {
  function dispatchToken(
    token: AnyToken,
    state: ConstructTreeState,
  ): ConstructTreeState {
    if (state.currentContext.type !== contextType) {
      throw new Error(
        `Expected construction context ${contextType}, received ${state.currentContext.type}.`,
      )
    }
    // Context frames bind their discriminant to their node; the check above
    // restores that correlation at the generic dispatch boundary.
    const contextualState = state as ConstructTreeState<Kind>
    for (const config of tokenHandlers) {
      const matchesTokenType =
        typeof config.tokenType === 'string'
          ? config.tokenType === token.type
          : config.tokenType.has(token.type)
      if (matchesTokenType) {
        return config.handler(token, contextualState)
      }
    }
    if (fallbackHandler) {
      return fallbackHandler(token, contextualState)
    }
    throw new Error(
      `Unhandled token ${token.type} in construction context ${contextType}.`,
    )
  }
  return Object.assign(dispatchToken, { contextType })
}

/**
 * Create an explicit token-consuming fallback.
 */
export function createConsumeHandler<
  Kind extends ConstructTreeContextTypes,
>(): TokenHandler<Kind> {
  return (_token, state) => consume(state)
}

/**
 * Run node updates before consuming exactly one token.
 */
export function createUpdateAndConsumeHandler<
  Kind extends ConstructTreeContextTypes,
>(
  updateNode: (token: AnyToken, state: ConstructTreeState<Kind>) => void,
): TokenHandler<Kind> {
  return (token, state) => {
    updateNode(token, state)
    return consume(state)
  }
}
