import type { TokenizeHandler } from '../../types'

export * as data from './data'
export * as closeTag from './closeTag'
export * as attributes from './attributes'
export * as openTagEnd from './openTagEnd'
export * as doctypeOpen from './doctypeOpen'
export * as doctypeClose from './doctypeClose'
export * as attributeKey from './attributeKey'
export * as openTagStart from './openTagStart'
export * as attributeValue from './attributeValue'
export * as commentContent from './commentContent'
export * as doctypeAttributes from './doctypeAttributes'
export * as attributeValueBare from './attributeValueBare'
export * as doctypeAttributeBare from './doctypeAttributeBare'
export * as attributeValueWrapped from './attributeValueWrapped'
export * as doctypeAttributeWrapped from './doctypeAttributeWrapped'

export const noop: TokenizeHandler = {
  parse: () => {},
}
