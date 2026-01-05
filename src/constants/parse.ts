/**
 * svg comment start
 */
export const COMMENT_START = '<!--'

/**
 * svg comment end
 */
export const COMMENT_END = '-->'

/**
 * xml declaration start
 */
export const XML_DECLARATION_START = '<?xml'

/**
 * xml declaration end
 */
export const XML_DECLARATION_END = '?>'

/**
 * regexp for open tag start
 * @regex101 https://regex101.com/?regex=%5E%3C%5Cw&flavor=javascript
 */
export const RE_OPEN_TAG_START = /^<\w/

/**
 * regexp for open tag name
 * @regex101 https://regex101.com/?regex=%5E%3C%28%5CS%2B%29&flavor=javascript
 */
export const RE_OPEN_TAG_NAME = /^<(\S+)/

/**
 * regexp for close tag name
 * @regex101 https://regex101.com/?regex=%5E%3C%5C%2F%28%28%3F%3A.%7C%5Cr%3F%5Cn%29*%29%3E%24&flavor=javascript
 */
export const RE_CLOSE_TAG_NAME = /^<\/((?:.|\r?\n)*)>$/

/**
 * regexp for incomplete closing tag
 * @regex101 https://regex101.com/?regex=%3C%5C%2F%5B%5E%3E%5D%2B%24&flavor=javascript
 */
export const RE_INCOMPLETE_CLOSING_TAG = /<\/[^>]+$/
