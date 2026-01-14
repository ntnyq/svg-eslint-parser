import type {
  AnyNode,
  AttributeNode,
  CommentNode,
  DoctypeAttributeNode,
  DoctypeNode,
  DocumentNode,
  TagNode,
  XMLDeclarationAttributeNode,
  XMLDeclarationNode,
} from './ast'

export type AnyContextualNode =
  | ContextualAttributeNode
  | ContextualCommentNode
  | ContextualDoctypeAttributeNode
  | ContextualDoctypeNode
  | ContextualDocumentNode
  | ContextualTagNode
  | ContextualXMLDeclarationAttributeNode
  | ContextuaLXMLDeclarationNode

export type ContextualAttributeNode = ContextualNode<
  AttributeNode,
  'key' | 'value'
>

export type ContextualCommentNode = ContextualNode<CommentNode, 'content'> & {
  // Legacy properties for handler compatibility
  close?: any
  open?: any
  value?: any
}

export type ContextualDoctypeAttributeNode = ContextualNode<
  DoctypeAttributeNode,
  'type' | 'value'
>

export type ContextualDoctypeNode = ContextualNode<
  DoctypeNode,
  'attributes'
> & {
  attributes: ContextualDoctypeAttributeNode[]
  // Legacy properties for handler compatibility
  close?: any
  open?: any
}

export type ContextualDocumentNode = Omit<
  ContextualNode<DocumentNode, never>,
  'children'
> & {
  children: Array<
    | DocumentNode['children'][number]
    | Exclude<AnyContextualNode, ContextualDoctypeNode>
  >
}

export type ContextualNode<T extends AnyNode, K extends keyof T> = PartialBy<
  T,
  K
> & {
  parentRef?: any
}

export type ContextualTagNode = ContextualNode<
  TagNode,
  'attributes' | 'children' | 'name' | 'selfClosing'
> & {
  attributes: ContextualAttributeNode[]
  close?: any
  openEnd?: any
  openStart?: any
  children: Array<
    | ContextualCommentNode
    | ContextualDoctypeNode
    | ContextualTagNode
    | TagNode['children'][number]
  >
}

export type ContextualXMLDeclarationAttributeNode = ContextualNode<
  XMLDeclarationAttributeNode,
  'key' | 'value'
>
export type ContextuaLXMLDeclarationNode = ContextualNode<
  XMLDeclarationNode,
  'attributes'
> & {
  attributes: ContextualXMLDeclarationAttributeNode[]
  // Legacy properties for handler compatibility
  close?: any
  open?: any
}

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
