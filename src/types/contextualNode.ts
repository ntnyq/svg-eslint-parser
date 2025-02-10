import type {
  AnyNode,
  AttributeNode,
  CommentNode,
  DoctypeAttributeNode,
  DoctypeNode,
  DocumentNode,
  TagNode,
} from './ast'

export type AnyContextualNode =
  | ContextualAttributeNode
  | ContextualCommentNode
  | ContextualDoctypeAttributeNode
  | ContextualDoctypeNode
  | ContextualDocumentNode
  | ContextualTagNode

export type ContextualAttributeNode = ContextualNode<
  AttributeNode,
  'key' | 'value'
>

export type ContextualCommentNode = ContextualNode<
  CommentNode,
  'close' | 'open' | 'value'
>

export type ContextualDoctypeAttributeNode = ContextualNode<
  DoctypeAttributeNode,
  'value'
>

export type ContextualDoctypeNode = ContextualNode<
  DoctypeNode,
  'close' | 'open'
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
  'close' | 'name' | 'openEnd' | 'openStart' | 'selfClosing'
> & {
  attributes: ContextualAttributeNode[]
  children: Array<
    | ContextualCommentNode
    | ContextualDoctypeNode
    | ContextualTagNode
    | TagNode['children'][number]
  >
}

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
