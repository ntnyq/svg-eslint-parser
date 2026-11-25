/**
 * Compatibility surface for the public AST namespace. Definitions live with
 * their owning modules; keep this list explicit to avoid exposing new internals.
 */

export { ParseErrorType } from '../diagnostics/types'
export type { AnyToken, Token } from '../tokenizer/token'
export type { Options, ParseResult } from '../parser/types'
export type { TokenizerState } from '../tokenizer/tokenizerState'
export type { TokenizeHandler } from '../tokenizer/tokenizerContextHandler'
export type {
  Locations,
  Position,
  Range,
  SourceLocation,
} from '../source/types'
export type {
  ErrorContext,
  ParseDiagnostic,
  ParseError,
} from '../diagnostics/types'
export type {
  ConstructTreeContext,
  ConstructTreeNodeMap,
} from '../treeBuilder/constructTreeState'
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
} from '../eslint/types'
export type {
  AnyContextualNode,
  ConstructTreeHandler,
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
  PartialBy,
} from '../compat/treeBuilderTypes'
export type {
  AnyNode,
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
  ProcessingInstructionNode,
  Program,
  SimpleNode,
  TextNode,
  XMLDeclarationAttributeKeyNode,
  XMLDeclarationAttributeNode,
  XMLDeclarationAttributeValueNode,
  XMLDeclarationNode,
} from '../ast/types'
