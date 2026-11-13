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
} from '../ast/types'

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
 * CDATA node initialized before its content and closing delimiter are read.
 */
export type ContextualCDATANode = ContextualNode<CDATANode, never>

/**
 * Comment node initialized before its content has been read.
 */
export type ContextualCommentNode = ContextualNode<CommentNode, never>

/**
 * Doctype attribute node before value has been finalized.
 */
export type ContextualDoctypeAttributeNode = ContextualNode<
  DoctypeAttributeNode,
  never
>

/**
 * Doctype node while its attributes are being collected.
 */
export type ContextualDoctypeNode = ContextualNode<DoctypeNode, never>

/**
 * Document root while child nodes are being attached.
 */
export type ContextualDocumentNode = ContextualNode<DocumentNode, never>

/**
 * Construction-time node with selected fields allowed to be incomplete.
 */
export type ContextualNode<T extends AnyNode, K extends keyof T> = PartialBy<
  T,
  K
> &
  ContextualParent

/**
 * Keep recursive parent links behind an interface so TypeScript can defer
 * resolving the contextual document and element aliases.
 */
interface ContextualParent {
  parentRef?: ContextualDocumentNode | ContextualElementNode
}

/**
 * Element node initialized with an empty name and child collections for recovery.
 */
export type ContextualElementNode = ContextualNode<ElementNode, never>

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
  never
>

/**
 * Make selected keys optional while leaving the rest of a type intact.
 */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
