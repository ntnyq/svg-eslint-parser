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
  XMLDeclarationOpen: [],
  XMLDeclarationClose: [],
  XMLDeclarationAttributeValueWrapperStart: [],
  XMLDeclarationAttributeValueWrapperEnd: [],

  Doctype: ['attributes'],
  DoctypeAttribute: ['value'],
  DoctypeAttributeValue: [],
  DoctypeOpen: [],
  DoctypeClose: [],
  DoctypeAttributeWrapperStart: [],
  DoctypeAttributeWrapperEnd: [],

  Attribute: ['key', 'value'],
  AttributeKey: [],
  AttributeValue: [],
  AttributeValueWrapperStart: [],
  AttributeValueWrapperEnd: [],

  Tag: ['attributes', 'children'],
  OpenTagStart: [],
  OpenTagEnd: [],
  CloseTag: [],

  Comment: [],
  CommentOpen: [],
  CommentClose: [],
  CommentContent: [],

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
