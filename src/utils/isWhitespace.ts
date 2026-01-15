import { SPECIAL_CHAR } from '../constants'

/**
 * Check if a character is whitespace (space, newline, return, or tab)
 * @param char - Character to check
 * @returns True if character is whitespace
 */
export function isWhitespace(char: string) {
  return (
    char === SPECIAL_CHAR.space
    || char === SPECIAL_CHAR.newline
    || char === SPECIAL_CHAR.return
    || char === SPECIAL_CHAR.tab
  )
}
