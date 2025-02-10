import { SPECIAL_CHAR } from '../constants'

export function isWhitespace(char: string) {
  return (
    char === SPECIAL_CHAR.space
    || char === SPECIAL_CHAR.newline
    || char === SPECIAL_CHAR.return
    || char === SPECIAL_CHAR.tab
  )
}
