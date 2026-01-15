import { cloneLocation } from './cloneLocation'
import { cloneRange } from './cloneRange'
import type { AnyToken } from '../types'

/**
 * Create a node object from a token, copying essential properties
 * @param token - Token to convert to a node
 * @returns Object with type, value, location, and range from the token
 */
export function createNodeFrom<T extends AnyToken>(token: T): unknown {
  const loc = cloneLocation(token.loc)
  const range = cloneRange(token.range)
  const result: any = {
    type: token.type,
    value: token.value,
    loc,
    range,
  }
  return result
}
