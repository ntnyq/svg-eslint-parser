import { LineIndex } from './getLineInfo'
import type { Range, SourceLocation } from '../types'

/**
 * Calculate the source location of a token based on its character range
 * @param source - Source code string
 * @param range - Character range [start, end]
 * @returns Object with start and end line/column information
 */
export function calculateTokenLocation(
  source: string,
  range: Range,
): SourceLocation {
  const lineIndex = new LineIndex(source)

  return {
    start: lineIndex.getPosition(range[0]),
    end: lineIndex.getPosition(range[1]),
  }
}
