import { RE_OPEN_TAG_NAME } from '../constants'

export function parseOpenTagName(openTagStartTokenContent: string): string {
  const match = openTagStartTokenContent.match(RE_OPEN_TAG_NAME)

  if (match === null) {
    throw new Error(
      `Unable to parse open tag name.\n${openTagStartTokenContent} does not match pattern of opening tag.`,
    )
  }

  return match[1].toLowerCase()
}
