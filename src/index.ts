import { visitorKeys } from './ast'
import { meta } from './meta'
import type * as AST from './types'

/**
 * Parser package name.
 */
export const name = meta.name

/**
 * ESLint visitor keys for parser-specific nodes.
 */
export const VisitorKeys = visitorKeys

export { meta } from './meta'
export { parse } from './parser/parse'

export { TokenTypes } from './tokenizer/tokenTypes'
export { ParseErrorType } from './diagnostics/types'
export { ParseError } from './diagnostics/parseError'
export { defineSVGRule } from './eslint/defineSVGRule'

export { parseForESLint } from './parser/parseForESLint'

export {
  DEPRECATED_SVG_ELEMENTS,
  SELF_CLOSING_ELEMENTS,
  SVG_ELEMENTS,
} from './syntax/svgElements'

export {
  cloneNode,
  cloneNodeWithParent,
  countNodes,
  filterNodes,
  findFirstNodeByType,
  getNodeDepth,
  getParentChain,
  isNodeType,
  mapNodes,
  NodeTypes,
  traverseAST,
  validateNode,
  walkAST,
} from './ast'
export {
  CDATA_END,
  CDATA_START,
  COMMENT_END,
  COMMENT_START,
  ConstructTreeContextTypes,
  findNodeByType,
  PROCESSING_INSTRUCTION_END,
  RE_CLOSE_TAG_NAME,
  RE_INCOMPLETE_CLOSING_TAG,
  RE_OPEN_TAG_NAME,
  RE_OPEN_TAG_START,
  RE_XML_NAME,
  SPECIAL_CHAR,
  TokenizerContextTypes,
  XML_DECLARATION_END,
  XML_DECLARATION_START,
} from './compat'

export type { Options } from './parser/types'

export type { ParseDiagnostic } from './diagnostics/types'

export type {
  ParseForESLintResult,
  SVGNodeMap,
  SVGParserServices,
  SVGRuleContext,
  SVGRuleListener,
  SVGRuleModule,
  SVGRuleNodeMap,
  SVGRuleNodeType,
  SVGSourceCode,
} from './eslint/types'
// Compatibility exports remain explicit so internal additions stay private.
export type {
  AnyContextualNode,
  ConstructTreeContext,
  ConstructTreeHandler,
  ConstructTreeNodeMap,
  ConstructTreeState,
  ContextualAttributeNode,
  ContextualCDATANode,
  ContextualCommentNode,
  ContextualDoctypeAttributeNode,
  ContextualDoctypeNode,
  ContextualDocumentNode,
  ContextualElementNode,
  ContextualNode,
  ContextualXMLDeclarationAttributeNode,
  ContextualXMLDeclarationNode,
  ErrorContext,
  ParseResult,
  PartialBy,
  TokenizeHandler,
  TokenizerState,
} from './compat'

export type {
  AnyNode,
  AnyToken,
  ASTVisitor,
  AttributeKeyNode,
  AttributeNode,
  AttributeValueNode,
  BaseNode,
  CDATANode,
  CommentNode,
  DoctypeAttributeNode,
  DoctypeAttributeValueNode,
  DoctypeNode,
  DocumentChildNode,
  DocumentNode,
  ElementChildNode,
  ElementNode,
  ErrorNode,
  ESLintComment,
  Locations,
  Position,
  ProcessingInstructionNode,
  Program,
  Range,
  SimpleNode,
  SourceLocation,
  TextNode,
  Token,
  XMLDeclarationAttributeKeyNode,
  XMLDeclarationAttributeNode,
  XMLDeclarationAttributeValueNode,
  XMLDeclarationNode,
} from './ast'

export type { AST }
