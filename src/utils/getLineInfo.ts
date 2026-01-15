/**
 * Check if a character code represents a line break
 * @param code - Character code to check
 * @returns True if code is a newline character (LF, CR, LS, PS)
 */
function isNewLine(code: number) {
  return code === 10 || code === 13 || code === 0x2028 || code === 0x2029
}

/**
 * Find the next line break position in a string
 * @param code - String to search
 * @param from - Starting position
 * @param end - Ending position (default: string length)
 * @returns Index of next line break, or -1 if not found
 */
function nextLineBreak(code: string, from: number, end = code.length) {
  for (let i = from; i < end; i++) {
    const next = code.codePointAt(i)

    if (!next) {
      continue
    }

    if (isNewLine(next)) {
      return i < end - 1 && next === 13 && code.codePointAt(i + 1) === 10
        ? i + 2
        : i + 1
    }
  }
  return -1
}

/**
 * Get the line and column number for a position in source code
 * @param input - Source code string
 * @param offset - Character offset position
 * @returns Object with line (1-indexed) and column (0-indexed) information
 */
export function getLineInfo(input: string, offset: number) {
  for (let line = 1, cur = 0; ; ) {
    const nextBreak = nextLineBreak(input, cur, offset)
    if (nextBreak < 0) {
      return { line, column: offset - cur }
    }
    ++line
    cur = nextBreak
  }
}
