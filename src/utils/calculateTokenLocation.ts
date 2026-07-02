import { getLineInfo } from './getLineInfo'
import type { Range } from '../types'

/**
 * Calculate the source location of a token based on its character range
 * @param source - Source code string
 * @param range - Character range [start, end]
 * @returns Object with start and end line/column information
 */
export function calculateTokenLocation(source: string, range: Range) {
  return {
    start: getLineInfo(source, range[0]),
    end: getLineInfo(source, range[1]),
  }
}
