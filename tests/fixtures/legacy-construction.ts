import { ConstructTreeContextTypes, NodeTypes } from 'svg-eslint-parser'
import type {
  AST,
  ConstructTreeHandler,
  ConstructTreeState,
  ContextualCDATANode,
  ContextualCommentNode,
  ContextualDoctypeAttributeNode,
  ContextualDoctypeNode,
  ContextualDocumentNode,
  ContextualElementNode,
  ContextualXMLDeclarationNode,
  ErrorContext,
  Locations,
} from 'svg-eslint-parser'

// Calls and node shapes accepted by the published construction types before
// the context-bound state refactor. This also compiles against emitted types.
const locations: Locations = {
  range: [0, 0],
  loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 0 } },
}

export const cdata: ContextualCDATANode = {
  type: NodeTypes.CDATA,
  ...locations,
}
export const comment: ContextualCommentNode = {
  type: NodeTypes.Comment,
  ...locations,
}
export const doctypeAttribute: ContextualDoctypeAttributeNode = locations
export const doctype: ContextualDoctypeNode = {
  type: NodeTypes.Doctype,
  attributes: [{ ...doctypeAttribute, type: NodeTypes.DoctypeAttribute }],
  ...locations,
}
export const declaration: ContextualXMLDeclarationNode = {
  type: NodeTypes.XMLDeclaration,
  attributes: [{ type: NodeTypes.XMLDeclarationAttribute, ...locations }],
  ...locations,
}
export const element: ContextualElementNode = {
  type: NodeTypes.Element,
  attributes: [{ type: NodeTypes.Attribute, ...locations }],
  children: [
    { ...cdata, value: '' },
    { ...comment, content: '', value: '' },
  ],
  parentRef: { unfinished: true },
  ...locations,
}
export const document: ContextualDocumentNode = {
  type: NodeTypes.Document,
  children: [element, doctype, declaration],
  ...locations,
}
export const namespacedDocument: AST.ContextualDocumentNode = document

export function createLegacyState(
  errorHandler: ErrorContext,
): ConstructTreeState<ContextualElementNode> {
  return {
    caretPosition: 0,
    currentNode: element,
    currentContext: {
      type: ConstructTreeContextTypes.Tag,
      content: ['unfinished'],
      parentRef: { saved: true },
    },
    rootNode: { type: NodeTypes.Document, children: [], ...locations },
    errorHandler,
  }
}

export function advanceLegacyState(
  state: ConstructTreeState<ContextualElementNode>,
): ContextualElementNode {
  state.caretPosition++
  state.currentNode.name = 'svg'
  state.currentNode.selfClosing = false
  state.currentContext.content?.push('pending')
  state.currentContext = { type: ConstructTreeContextTypes.TagContent }
  return state.currentNode
}

export function advanceNamespacedState(
  state: AST.ConstructTreeState<AST.ContextualElementNode>,
): AST.ContextualElementNode {
  state.caretPosition++
  state.currentNode.name = 'g'
  return state.currentNode
}

export const handler: ConstructTreeHandler = {
  construct(_token, state) {
    state.caretPosition++
    state.currentNode.name = 'legacy'
    return state
  },
}
export const namespacedHandler: AST.ConstructTreeHandler = handler
