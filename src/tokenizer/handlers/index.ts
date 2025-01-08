import type { TokenizeHandler } from '../../types'

export * as data from './data'
export * as commentContent from './commentContent'

/**
 * tag
 */
export * as closeTag from './closeTag'
export * as openTagEnd from './openTagEnd'
export * as openTagStart from './openTagStart'

/**
 * attribute
 */
export * as attributes from './attributes'
export * as attributeKey from './attributeKey'
export * as attributeValue from './attributeValue'
export * as attributeValueBare from './attributeValueBare'
export * as attributeValueWrapped from './attributeValueWrapped'

/**
 * doctype
 */
export * as doctypeOpen from './doctypeOpen'
export * as doctypeClose from './doctypeClose'
/**
 * doctype attribute
 */
export * as doctypeAttributes from './doctypeAttributes'
export * as doctypeAttributeBare from './doctypeAttributeBare'
export * as doctypeAttributeWrapped from './doctypeAttributeWrapped'

/**
 * xml declaration
 */
export * as xmlDeclarationOpen from './xmlDeclarationOpen'
export * as xmlDeclarationClose from './xmlDeclarationClose'
export * as xmlDeclarationAttributes from './xmlDeclarationAttributes'
export * as xmlDeclarationAttributeKey from './xmlDeclarationAttributeKey'
export * as xmlDeclarationAttributeValue from './xmlDeclarationAttributeValue'
export * as xmlDeclarationAttributeValueWrapped from './xmlDeclarationAttributeValueWrapped'

export const noop: TokenizeHandler = {
  parse: () => {},
}
