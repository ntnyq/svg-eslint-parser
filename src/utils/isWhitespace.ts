import { SPECIAL_CHAR } from '../constants'

const WHITESPACE_CHARS = new Set([
  SPECIAL_CHAR.space,
  SPECIAL_CHAR.newline,
  SPECIAL_CHAR.return,
  SPECIAL_CHAR.tab,
])

/**
 * Check if a character is whitespace (space, newline, return, or tab)
 * @param char - Character to check
 * @returns True if character is whitespace
 */
export function isWhitespace(char: string) {
  return WHITESPACE_CHARS.has(char)
}
