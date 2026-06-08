import type {
  AnyNode,
  AttributeNode,
  CommentNode,
  DoctypeAttributeNode,
  DoctypeNode,
  DocumentNode,
  ElementNode,
  XMLDeclarationAttributeNode,
  XMLDeclarationNode,
} from './ast'

export type AnyContextualNode =
  | ContextualAttributeNode
  | ContextualCommentNode
  | ContextualDoctypeAttributeNode
  | ContextualDoctypeNode
  | ContextualDocumentNode
  | ContextualElementNode
  | ContextualXMLDeclarationAttributeNode
  | ContextualXMLDeclarationNode

export type ContextualAttributeNode = ContextualNode<
  AttributeNode,
  'key' | 'value'
>

export type ContextualCommentNode = ContextualNode<CommentNode, 'content'>

export type ContextualDoctypeAttributeNode = ContextualNode<
  DoctypeAttributeNode,
  'type' | 'value'
>

export type ContextualDoctypeNode = ContextualNode<
  DoctypeNode,
  'attributes'
> & {
  attributes: ContextualDoctypeAttributeNode[]
}

export type ContextualDocumentNode = Omit<
  ContextualNode<DocumentNode, never>,
  'children'
> & {
  children: Array<
    | DocumentNode['children'][number]
    | ContextualCommentNode
    | ContextualDoctypeNode
    | ContextualElementNode
    | ContextualXMLDeclarationNode
  >
}

export type ContextualNode<T extends AnyNode, K extends keyof T> = PartialBy<
  T,
  K
> & {
  parentRef?: any
}

export type ContextualElementNode = ContextualNode<
  ElementNode,
  'attributes' | 'children' | 'name' | 'selfClosing'
> & {
  attributes: ContextualAttributeNode[]
  children: Array<
    | ContextualCommentNode
    | ContextualElementNode
    | ElementNode['children'][number]
  >
}

export type ContextualXMLDeclarationAttributeNode = ContextualNode<
  XMLDeclarationAttributeNode,
  'key' | 'value'
>
export type ContextualXMLDeclarationNode = ContextualNode<
  XMLDeclarationNode,
  'attributes'
> & {
  attributes: ContextualXMLDeclarationAttributeNode[]
}

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
