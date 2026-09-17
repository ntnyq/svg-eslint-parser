/**
 * svg comment start
 */
export const COMMENT_START = '<!--'

/**
 * svg comment end
 */
export const COMMENT_END = '-->'

/**
 * CDATA section start
 */
export const CDATA_START = '<![CDATA['

/**
 * CDATA section end
 */
export const CDATA_END = ']]>'

/**
 * xml declaration start
 */
export const XML_DECLARATION_START = '<?xml'

/**
 * xml declaration end
 */
export const XML_DECLARATION_END = '?>'

/**
 * processing instruction end
 */
export const PROCESSING_INSTRUCTION_END = '?>'

// XML 1.0 (Fifth Edition), productions [4] and [4a].
const XML_NAME_START_CHAR =
  ':A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF' +
  '\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F' +
  '\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD' +
  '\\u{10000}-\\u{EFFFF}'

/**
 * Complete XML name, shared by element, attribute, and declaration validation.
 */
export const RE_XML_NAME = new RegExp(
  // Preserve the XML productions, including combining marks and explicit ranges.
  // eslint-disable-next-line no-misleading-character-class, regexp/no-useless-range, regexp/prefer-w
  `^[${XML_NAME_START_CHAR}][${XML_NAME_START_CHAR}\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$`,
  'u',
)

/**
 * Opening tag candidate. Include digits to preserve malformed names for recovery.
 */
export const RE_OPEN_TAG_START = new RegExp(
  // eslint-disable-next-line regexp/no-useless-range, regexp/prefer-w
  `^<[${XML_NAME_START_CHAR}0-9]`,
  'u',
)

/**
 * regexp for open tag name
 */
export const RE_OPEN_TAG_NAME = /^<(?<tagName>[^\t\n\r ]+)/u

/**
 * regexp for close tag name
 */
export const RE_CLOSE_TAG_NAME = /^<\/(?<tagName>.*)>$/su

/**
 * regexp for incomplete closing tag
 * @regex101 https://regex101.com/?regex=%3C%5C%2F%5B%5E%3E%5D%2B%24&flags=u&flavor=javascript
 */
export const RE_INCOMPLETE_CLOSING_TAG = /<\/[^>]+$/u
