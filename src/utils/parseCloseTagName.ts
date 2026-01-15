import { RE_CLOSE_TAG_NAME } from '../constants'

/**
 * Parse the tag name from a closing tag token content
 * @param closeTagTokenContent - Raw closing tag content (e.g., "</svg>")
 * @returns Extracted and normalized tag name in lowercase
 * @throws {Error} if content doesn't match closing tag pattern
 */
export function parseCloseTagName(closeTagTokenContent: string): string {
  const match = closeTagTokenContent.match(RE_CLOSE_TAG_NAME)

  if (match === null) {
    throw new Error(
      `Unable to parse close tag name.\n${closeTagTokenContent} does not match pattern of closing tag.`,
    )
  }

  return match[1].trim().toLowerCase()
}
