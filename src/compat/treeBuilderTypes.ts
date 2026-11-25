import type {
  AnyNode,
  AttributeNode,
  CDATANode,
  CommentNode,
  DoctypeAttributeNode,
  DoctypeNode,
  DocumentNode,
  ElementNode,
  ProcessingInstructionNode,
  XMLDeclarationAttributeNode,
  XMLDeclarationNode,
} from '../ast/types'
import type { ErrorContext } from '../diagnostics/types'
import type { AnyToken } from '../tokenizer/token'
import type { ConstructTreeContextTypes } from '../treeBuilder/constructTreeContextTypes'
import type { PartialBy } from '../treeBuilder/contextualNode'

// These published definitions deliberately retain their original partial nodes,
// mutable fields, and any boundaries. Stronger parser types stay in treeBuilder.

/**
 * Union of AST nodes while they are still being constructed.
 * @deprecated Retained for existing construction code; parser internals use
 * their context-bound types from treeBuilder instead.
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
 * @deprecated Retained for existing construction code; parser internals use
 * their context-bound types from treeBuilder instead.
 */
export type ContextualAttributeNode = ContextualNode<
  AttributeNode,
  'key' | 'value'
>

/**
 * CDATA node before its content and closing delimiter are finalized.
 * @deprecated Retained for existing construction code; parser internals use
 * their context-bound types from treeBuilder instead.
 */
export type ContextualCDATANode = ContextualNode<CDATANode, 'value'>

/**
 * Comment node before comment content has been finalized.
 * @deprecated Retained for existing construction code; parser internals use
 * their context-bound types from treeBuilder instead.
 */
export type ContextualCommentNode = ContextualNode<
  CommentNode,
  'content' | 'value'
>

/**
 * Doctype attribute node before value has been finalized.
 * @deprecated Retained for existing construction code; parser internals use
 * their context-bound types from treeBuilder instead.
 */
export type ContextualDoctypeAttributeNode = ContextualNode<
  DoctypeAttributeNode,
  'type' | 'value'
>

/**
 * Doctype node while its attributes are being collected.
 * @deprecated Retained for existing construction code; parser internals use
 * their context-bound types from treeBuilder instead.
 */
export type ContextualDoctypeNode = ContextualNode<
  DoctypeNode,
  'attributes'
> & {
  attributes: ContextualDoctypeAttributeNode[]
}

/**
 * Document root while child nodes are being attached.
 * @deprecated Retained for existing construction code; parser internals use
 * their context-bound types from treeBuilder instead.
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
    | ProcessingInstructionNode
  >
}

/**
 * Construction-time node with selected fields allowed to be incomplete.
 * @deprecated Retained for existing construction code; parser internals use
 * their context-bound types from treeBuilder instead.
 */
export type ContextualNode<T extends AnyNode, K extends keyof T> = PartialBy<
  T,
  K
> & {
  parentRef?: any
}

/**
 * Element node while name, attributes, and children are being collected.
 * @deprecated Retained for existing construction code; parser internals use
 * their context-bound types from treeBuilder instead.
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
    | ProcessingInstructionNode
  >
}

/**
 * XML declaration attribute node before key/value are finalized.
 * @deprecated Retained for existing construction code; parser internals use
 * their context-bound types from treeBuilder instead.
 */
export type ContextualXMLDeclarationAttributeNode = ContextualNode<
  XMLDeclarationAttributeNode,
  'key' | 'value'
>
/**
 * XML declaration node while attributes are being collected.
 * @deprecated Retained for existing construction code; parser internals use
 * their context-bound types from treeBuilder instead.
 */
export type ContextualXMLDeclarationNode = ContextualNode<
  XMLDeclarationNode,
  'attributes'
> & {
  attributes: ContextualXMLDeclarationAttributeNode[]
}

/**
 * Mutable state shared by AST construction handlers.
 * @deprecated Retained for existing construction code; parser internals use
 * their context-bound types from treeBuilder instead.
 */
export type ConstructTreeState<
  Node extends AnyContextualNode = AnyContextualNode,
> = {
  caretPosition: number
  currentNode: Node
  errorHandler: ErrorContext
  rootNode: DocumentNode
  currentContext: {
    type: ConstructTreeContextTypes
    content?: any[]
    parentRef?: any
  }
}

/**
 * Constructor handler for a single AST construction context.
 * @deprecated Retained for existing construction code; parser internals use
 * their context-bound types from treeBuilder instead.
 */
export interface ConstructTreeHandler {
  construct: (
    token: AnyToken,
    state: ConstructTreeState<any>,
  ) => ConstructTreeState<any>
}

export type { PartialBy } from '../treeBuilder/contextualNode'
