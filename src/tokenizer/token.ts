import type { Locations } from '../source/types'
import type { TokenTypes } from './tokenTypes'

/**
 * Union of all tokenizer output token shapes.
 */
export type AnyToken = Token<TokenTypes>

/**
 * Source token emitted by the tokenizer.
 */
export interface Token<T extends TokenTypes> extends Locations {
  /**
   * node type
   */
  type: T
  /**
   * token value
   */
  value: string
}
