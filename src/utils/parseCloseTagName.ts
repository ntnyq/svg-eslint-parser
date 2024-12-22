import { RE_CLOSE_TAG_NAME } from '../constants'

export function parseCloseTagName(closeTagTokenContent: string): string {
  const match = closeTagTokenContent.match(RE_CLOSE_TAG_NAME)

  if (match === null) {
    throw new Error(
      `Unable to parse close tag name.\n${closeTagTokenContent} does not match pattern of closing tag.`,
    )
  }

  return match[1].trim().toLowerCase()
}
