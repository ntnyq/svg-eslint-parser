import type { Range } from '../types'

export function cloneRange(range: Range): Range {
  return [range[0], range[1]]
}
