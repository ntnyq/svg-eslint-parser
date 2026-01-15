import type { Range } from '../types'

/**
 * Create a shallow copy of a range tuple
 * @param range - Range tuple [start, end] to clone
 * @returns New range tuple with copied values
 */
export function cloneRange(range: Range): Range {
  return [range[0], range[1]]
}
