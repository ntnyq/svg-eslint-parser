import type { Position } from '../types'

const LINE_BREAK_CHARACTERS = new Set(['\n', '\u{2028}', '\u{2029}'])

/**
 * Precomputed line starts for repeated offset-to-location lookups.
 */
export class LineIndex {
  private readonly lineStarts: number[] = [0]

  public constructor(source: string) {
    for (let index = 0; index < source.length; index++) {
      const character = source[index]

      if (character === '\r') {
        if (source[index + 1] === '\n') {
          index++
        }
        this.lineStarts.push(index + 1)
      } else if (LINE_BREAK_CHARACTERS.has(character)) {
        this.lineStarts.push(index + 1)
      }
    }
  }

  /**
   * Resolve a character offset with a binary search over line starts.
   */
  public getPosition(offset: number): Position {
    let low = 0
    let high = this.lineStarts.length

    while (low < high) {
      const middle = Math.floor((low + high) / 2)

      if (this.lineStarts[middle] <= offset) {
        low = middle + 1
      } else {
        high = middle
      }
    }

    const lineIndex = Math.max(0, low - 1)

    return {
      line: lineIndex + 1,
      column: offset - this.lineStarts[lineIndex],
    }
  }
}

/**
 * Get the line and column number for a position in source code.
 * @param input - Source code string
 * @param offset - Character offset position
 * @returns Object with line (1-indexed) and column (0-indexed) information
 */
export function getLineInfo(input: string, offset: number): Position {
  return new LineIndex(input).getPosition(offset)
}
