import type {
  AnyNode,
  AttributeNode,
  CDATANode,
  CommentNode,
  DoctypeAttributeNode,
  DoctypeNode,
  DocumentNode,
  ElementNode,
  XMLDeclarationAttributeNode,
  XMLDeclarationNode,
} from './ast'

/**
 * Union of AST nodes while they are still being constructed.
 */
export type AnyContextualNode =
  | ContextualAttributeNode
  | ContextualCDATANode
  | ContextualCommentNode
  | ContextualDoctypeAttributeNode
  | ContextualDoctypeNode
  | ContextualDocumentNode
  | ContextualElementNode
  | ContextualXMLDeclarationAttributeNode
  | ContextualXMLDeclarationNode

/**
 * Attribute node with key/value filled as tokens are consumed.
 */
export type ContextualAttributeNode = ContextualNode<
  AttributeNode,
  'key' | 'value'
>

/**
 * CDATA node before its content and closing delimiter are finalized.
 */
export type ContextualCDATANode = ContextualNode<CDATANode, 'value'>

/**
 * Comment node before comment content has been finalized.
 */
export type ContextualCommentNode = ContextualNode<
  CommentNode,
  'content' | 'value'
>

/**
 * Doctype attribute node before value has been finalized.
 */
export type ContextualDoctypeAttributeNode = ContextualNode<
  DoctypeAttributeNode,
  'type' | 'value'
>

/**
 * Doctype node while its attributes are being collected.
 */
export type ContextualDoctypeNode = ContextualNode<
  DoctypeNode,
  'attributes'
> & {
  attributes: ContextualDoctypeAttributeNode[]
}

/**
 * Document root while child nodes are being attached.
 */
export type ContextualDocumentNode = Omit<
  ContextualNode<DocumentNode, never>,
  'children'
> & {
  children: Array<
    | ContextualCDATANode
    | ContextualCommentNode
    | ContextualDoctypeNode
    | ContextualElementNode
    | ContextualXMLDeclarationNode
    | DocumentNode['children'][number]
  >
}

/**
 * Construction-time node with selected fields allowed to be incomplete.
 */
export type ContextualNode<T extends AnyNode, K extends keyof T> = PartialBy<
  T,
  K
> & {
  parentRef?: any
}

/**
 * Element node while name, attributes, and children are being collected.
 */
export type ContextualElementNode = ContextualNode<
  ElementNode,
  'attributes' | 'children' | 'name' | 'selfClosing'
> & {
  attributes: ContextualAttributeNode[]
  children: Array<
    | ContextualCDATANode
    | ContextualCommentNode
    | ContextualElementNode
    | ElementNode['children'][number]
  >
}

/**
 * XML declaration attribute node before key/value are finalized.
 */
export type ContextualXMLDeclarationAttributeNode = ContextualNode<
  XMLDeclarationAttributeNode,
  'key' | 'value'
>
/**
 * XML declaration node while attributes are being collected.
 */
export type ContextualXMLDeclarationNode = ContextualNode<
  XMLDeclarationNode,
  'attributes'
> & {
  attributes: ContextualXMLDeclarationAttributeNode[]
}

/**
 * Make selected keys optional while leaving the rest of a type intact.
 */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
