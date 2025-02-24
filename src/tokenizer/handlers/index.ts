import type { TokenizeHandler } from '../../types'

export * as data from './data'
export * as closeTag from './closeTag'
export * as openTagEnd from './openTagEnd'
export * as attributes from './attributes'
export * as doctypeOpen from './doctypeOpen'
export * as openTagStart from './openTagStart'
export * as attributeKey from './attributeKey'
export * as doctypeClose from './doctypeClose'
export * as commentContent from './commentContent'
export * as attributeValue from './attributeValue'
export * as doctypeAttributes from './doctypeAttributes'
export * as attributeValueBare from './attributeValueBare'
export * as xmlDeclarationOpen from './xmlDeclarationOpen'
export * as xmlDeclarationClose from './xmlDeclarationClose'
export * as doctypeAttributeBare from './doctypeAttributeBare'
export * as attributeValueWrapped from './attributeValueWrapped'
export * as doctypeAttributeWrapped from './doctypeAttributeWrapped'
export * as xmlDeclarationAttributes from './xmlDeclarationAttributes'
export * as xmlDeclarationAttributeKey from './xmlDeclarationAttributeKey'
export * as xmlDeclarationAttributeValue from './xmlDeclarationAttributeValue'
export * as xmlDeclarationAttributeValueWrapped from './xmlDeclarationAttributeValueWrapped'

export const noop: TokenizeHandler = {
  parse: () => {},
}
