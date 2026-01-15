import { unionWith } from 'eslint-visitor-keys'
import type { SourceCode } from 'eslint'
import type { AnyNode } from './types'

const keys: {
  [key in AnyNode['type']]: string[]
} = {
  Program: ['body'],
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

  Tag: ['attributes', 'children'],

  Comment: [],

  Text: [],

  Error: [],
}

let vistorKeysCache: SourceCode.VisitorKeys | null = null

export function getVisitorKeys(): SourceCode.VisitorKeys {
  if (!vistorKeysCache) {
    vistorKeysCache = unionWith(keys) as SourceCode.VisitorKeys
  }
  return vistorKeysCache
}

export const visitorKeys = getVisitorKeys()
