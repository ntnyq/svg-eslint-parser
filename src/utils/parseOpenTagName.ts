import { RE_OPEN_TAG_NAME } from '../constants'

/**
 * Parse the tag name from an opening tag token content
 * @param openTagStartTokenContent - Raw opening tag content (e.g., "<svg ")
 * @returns Extracted and normalized tag name in lowercase
 * @throws {Error} if content doesn't match opening tag pattern
 */
export function parseOpenTagName(openTagStartTokenContent: string): string {
  const match = openTagStartTokenContent.match(RE_OPEN_TAG_NAME)

  if (match === null) {
    throw new Error(
      `Unable to parse open tag name.\n${openTagStartTokenContent} does not match pattern of opening tag.`,
    )
  }

  return match[1].toLowerCase()
}
