import type { SourceCode } from 'eslint'
import type { AnyNode } from './types'

const keys: {
  [key in AnyNode['type']]: string[]
} = {
  Program: ['document'],
  Document: ['children'],

  XMLDeclaration: ['attributes'],
  XMLDeclarationAttribute: ['key', 'value'],
  XMLDeclarationAttributeKey: [],
  XMLDeclarationAttributeValue: [],

  Doctype: ['attributes'],
  DoctypeAttribute: ['value'],
  DoctypeAttributeValue: [],

  Attribute: ['key', 'value'],
  AttributeKey: [],
  AttributeValue: [],

  Element: ['attributes', 'children'],

  CDATA: [],
  Comment: [],

  Text: [],

  Error: [],
  ProcessingInstruction: [],
}

/**
 * Shared visitor key map used by parser traversal and ESLint integration.
 */
export const visitorKeys: SourceCode.VisitorKeys = {
  ...keys,
  Tag: keys.Element,
}

/**
 * Get the parser's visitor keys.
 * @returns Shared visitor key map
 */
export function getVisitorKeys(): SourceCode.VisitorKeys {
  return visitorKeys
}
