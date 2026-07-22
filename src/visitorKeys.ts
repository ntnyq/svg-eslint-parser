import { unionWith } from 'eslint-visitor-keys'
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
}

let vistorKeysCache: SourceCode.VisitorKeys | null = null

/**
 * Get ESLint visitor keys extended with parser-specific AST nodes.
 * @returns Cached visitor key map
 */
export function getVisitorKeys(): SourceCode.VisitorKeys {
  if (!vistorKeysCache) {
    const merged = unionWith(keys) as SourceCode.VisitorKeys
    vistorKeysCache = {
      ...merged,
      Tag: merged.Element,
    }
  }
  return vistorKeysCache
}

/**
 * Shared visitor key map used by parser traversal and ESLint integration.
 */
export const visitorKeys = getVisitorKeys()
