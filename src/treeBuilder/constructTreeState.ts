import type { ErrorContext } from '../diagnostics/types'
import type { ConstructTreeContextTypes } from './constructTreeContextTypes'
import type {
  ContextualCDATANode,
  ContextualCommentNode,
  ContextualDoctypeNode,
  ContextualDocumentNode,
  ContextualElementNode,
  ContextualXMLDeclarationNode,
} from './contextualNode'

/**
 * Node owned by each construction context. Content can belong to the document
 * or an element; attributes continue to operate on their owning declaration.
 */
export interface ConstructTreeNodeMap {
  Attribute: ContextualElementNode
  Attributes: ContextualElementNode
  AttributeValue: ContextualElementNode
  CDATA: ContextualCDATANode
  Comment: ContextualCommentNode
  Doctype: ContextualDoctypeNode
  DoctypeAttribute: ContextualDoctypeNode
  DoctypeAttributes: ContextualDoctypeNode
  Tag: ContextualElementNode
  TagContent: ContextualDocumentNode | ContextualElementNode
  TagName: ContextualElementNode
  XMLDeclaration: ContextualXMLDeclarationNode
  XMLDeclarationAttribute: ContextualXMLDeclarationNode
  XMLDeclarationAttributes: ContextualXMLDeclarationNode
  XMLDeclarationAttributeValue: ContextualXMLDeclarationNode
}

/**
 * Immutable stack frame binding a context to its construction-time node.
 */
export type ConstructTreeContext<
  Kind extends ConstructTreeContextTypes = ConstructTreeContextTypes,
> = {
  [Type in Kind]: {
    readonly node: ConstructTreeNodeMap[Type]
    readonly type: Type
    readonly parentRef?: ConstructTreeContext
  }
}[Kind]

/**
 * Construction state. Transitions replace the frame and index together while
 * nodes and diagnostics remain mutable. The frame is the only current-node owner.
 */
export interface ConstructTreeState<
  Kind extends ConstructTreeContextTypes = ConstructTreeContextTypes,
> {
  /**
   * Zero-based index of the next token to process, retained under its legacy name.
   * This counts tokens, not source characters.
   */
  readonly caretPosition: number
  readonly currentContext: ConstructTreeContext<Kind>
  readonly errorHandler: ErrorContext
  readonly rootNode: ContextualDocumentNode
}
