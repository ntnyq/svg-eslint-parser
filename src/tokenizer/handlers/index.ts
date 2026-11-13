import type { TokenizeHandler } from '../tokenizerContextHandler'

export * as data from './data'
export * as closeTag from './closeTag'
export * as attributes from './attributes'
export * as openTagEnd from './openTagEnd'
export * as doctypeOpen from './doctypeOpen'
export * as attributeKey from './attributeKey'
export * as cdataContent from './cdataContent'
export * as doctypeClose from './doctypeClose'
export * as openTagStart from './openTagStart'
export * as attributeValue from './attributeValue'
export * as commentContent from './commentContent'
export * as doctypeAttributes from './doctypeAttributes'
export * as xmlDeclarationOpen from './xmlDeclarationOpen'
export * as xmlDeclarationClose from './xmlDeclarationClose'
export * as quotedAttributeValue from './quotedAttributeValue'
export * as doctypeInternalSubset from './doctypeInternalSubset'
export * as processingInstruction from './processingInstruction'
export * as quotedDoctypeAttribute from './quotedDoctypeAttribute'
export * as unquotedAttributeValue from './unquotedAttributeValue'
export * as unquotedDoctypeAttribute from './unquotedDoctypeAttribute'
export * as xmlDeclarationAttributes from './xmlDeclarationAttributes'
export * as xmlDeclarationAttributeKey from './xmlDeclarationAttributeKey'
export * as xmlDeclarationAttributeValue from './xmlDeclarationAttributeValue'
export * as quotedXMLDeclarationAttributeValue from './quotedXMLDeclarationAttributeValue'

/**
 * Tokenizer handler for contexts that intentionally consume no content.
 */
export const noop: TokenizeHandler = {
  // oxlint-disable-next-line no-empty-function
  parse: () => {},
}
