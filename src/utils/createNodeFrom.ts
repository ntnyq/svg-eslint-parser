import { cloneLocation } from './cloneLocation'
import { cloneRange } from './cloneRange'
import type { AnyToken } from '../types'

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
