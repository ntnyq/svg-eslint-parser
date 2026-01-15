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
export type ContextualXMLDeclarationNode = ContextualNode<
  XMLDeclarationNode,
  'attributes'
> & {
  attributes: ContextualXMLDeclarationAttributeNode[]
}

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
