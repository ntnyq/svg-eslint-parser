import { unionWith } from 'eslint-visitor-keys'
import type { SourceCode } from 'eslint'
import type { AnyNode } from './types'

const keys: {
  [key in AnyNode['type']]: string[]
} = {
  Program: ['body'],
  Document: ['children'],

  XMLDeclaration: [],
  XMLDeclarationAttribute: ['key', 'value'],

  Doctype: ['open', 'close', 'attributes'],
  DoctypeOpen: [],
  DoctypeClose: [],
  DoctypeAttribute: ['key', 'value'],
  DoctypeAttributeValue: ['value'],
  DoctypeAttributeWrapperEnd: [],
  DoctypeAttributeWrapperStart: [],

  Attribute: ['key', 'value'],
  AttributeKey: ['value'],
  AttributeValue: ['value'],
  AttributeValueWrapperEnd: [],
  AttributeValueWrapperStart: [],

  Tag: ['children', 'attributes'],
  OpenTagEnd: [],
  OpenTagStart: [],
  CloseTag: [],

  Comment: ['open', 'close', 'value'],
  CommentOpen: [],
  CommentClose: [],
  CommentContent: [],

  Literal: [],
  Text: [],
}

let vistorKeysCache: SourceCode.VisitorKeys | null = null

export function getVisitorKeys(): SourceCode.VisitorKeys {
  if (!vistorKeysCache) {
    vistorKeysCache = unionWith(keys) as SourceCode.VisitorKeys
  }
  return vistorKeysCache
}

export const visitorKeys = getVisitorKeys()
