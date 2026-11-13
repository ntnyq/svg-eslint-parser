import { describe, expectTypeOf, it } from 'vitest'
import type * as Public from '../src'
import type { NodeTypes as OwnedNodeTypes } from '../src/ast/nodeTypes'
import type { ASTVisitor as OwnedASTVisitor } from '../src/ast/traverseAST'
import type {
  AnyNode as NamespaceAnyNode,
  AttributeKeyNode as NamespaceAttributeKeyNode,
  AttributeNode as NamespaceAttributeNode,
  AttributeValueNode as NamespaceAttributeValueNode,
  BaseNode as NamespaceBaseNode,
  CDATANode as NamespaceCDATANode,
  CommentNode as NamespaceCommentNode,
  DoctypeAttributeNode as NamespaceDoctypeAttributeNode,
  DoctypeAttributeValueNode as NamespaceDoctypeAttributeValueNode,
  DoctypeNode as NamespaceDoctypeNode,
  DocumentChildNode as NamespaceDocumentChildNode,
  DocumentNode as NamespaceDocumentNode,
  ElementChildNode as NamespaceElementChildNode,
  ElementNode as NamespaceElementNode,
  ErrorNode as NamespaceErrorNode,
  ESLintComment as NamespaceESLintComment,
  ProcessingInstructionNode as NamespaceProcessingInstructionNode,
  Program as NamespaceProgram,
  SimpleNode as NamespaceSimpleNode,
  TextNode as NamespaceTextNode,
  XMLDeclarationAttributeKeyNode as NamespaceXMLDeclarationAttributeKeyNode,
  XMLDeclarationAttributeNode as NamespaceXMLDeclarationAttributeNode,
  XMLDeclarationAttributeValueNode as NamespaceXMLDeclarationAttributeValueNode,
  XMLDeclarationNode as NamespaceXMLDeclarationNode,
  AnyNode as OwnedAnyNode,
  AttributeKeyNode as OwnedAttributeKeyNode,
  AttributeNode as OwnedAttributeNode,
  AttributeValueNode as OwnedAttributeValueNode,
  BaseNode as OwnedBaseNode,
  CDATANode as OwnedCDATANode,
  CommentNode as OwnedCommentNode,
  DoctypeAttributeNode as OwnedDoctypeAttributeNode,
  DoctypeAttributeValueNode as OwnedDoctypeAttributeValueNode,
  DoctypeNode as OwnedDoctypeNode,
  DocumentChildNode as OwnedDocumentChildNode,
  DocumentNode as OwnedDocumentNode,
  ElementChildNode as OwnedElementChildNode,
  ElementNode as OwnedElementNode,
  ErrorNode as OwnedErrorNode,
  ESLintComment as OwnedESLintComment,
  ProcessingInstructionNode as OwnedProcessingInstructionNode,
  Program as OwnedProgram,
  SimpleNode as OwnedSimpleNode,
  TextNode as OwnedTextNode,
  XMLDeclarationAttributeKeyNode as OwnedXMLDeclarationAttributeKeyNode,
  XMLDeclarationAttributeNode as OwnedXMLDeclarationAttributeNode,
  XMLDeclarationAttributeValueNode as OwnedXMLDeclarationAttributeValueNode,
  XMLDeclarationNode as OwnedXMLDeclarationNode,
} from '../src/ast/types'
import type { ParseError as OwnedParseError } from '../src/diagnostics/parseError'
import type {
  ErrorContext as NamespaceErrorContext,
  ParseDiagnostic as NamespaceParseDiagnostic,
  ParseError as NamespaceParseError,
  ParseErrorType as NamespaceParseErrorType,
  ErrorContext as OwnedErrorContext,
  ParseDiagnostic as OwnedParseDiagnostic,
  ParseErrorType as OwnedParseErrorType,
} from '../src/diagnostics/types'
import type {
  ParseForESLintResult as NamespaceParseForESLintResult,
  SVGNodeMap as NamespaceSVGNodeMap,
  SVGParserServices as NamespaceSVGParserServices,
  SVGRuleContext as NamespaceSVGRuleContext,
  SVGRuleListener as NamespaceSVGRuleListener,
  SVGRuleModule as NamespaceSVGRuleModule,
  SVGRuleNodeMap as NamespaceSVGRuleNodeMap,
  SVGRuleNodeType as NamespaceSVGRuleNodeType,
  SVGSourceCode as NamespaceSVGSourceCode,
  ParseForESLintResult as OwnedParseForESLintResult,
  SVGNodeMap as OwnedSVGNodeMap,
  SVGParserServices as OwnedSVGParserServices,
  SVGRuleContext as OwnedSVGRuleContext,
  SVGRuleListener as OwnedSVGRuleListener,
  SVGRuleModule as OwnedSVGRuleModule,
  SVGRuleNodeMap as OwnedSVGRuleNodeMap,
  SVGRuleNodeType as OwnedSVGRuleNodeType,
  SVGSourceCode as OwnedSVGSourceCode,
} from '../src/eslint/types'
import type {
  Options as NamespaceOptions,
  ParseResult as NamespaceParseResult,
  Options as OwnedOptions,
  ParseResult as OwnedParseResult,
} from '../src/parser/types'
import type {
  Locations as NamespaceLocations,
  Position as NamespacePosition,
  Range as NamespaceRange,
  SourceLocation as NamespaceSourceLocation,
  Locations as OwnedLocations,
  Position as OwnedPosition,
  Range as OwnedRange,
  SourceLocation as OwnedSourceLocation,
} from '../src/source/types'
import type {
  AnyToken as NamespaceAnyToken,
  Token as NamespaceToken,
  AnyToken as OwnedAnyToken,
  Token as OwnedToken,
} from '../src/tokenizer/token'
import type {
  TokenizeHandler as NamespaceTokenizeHandler,
  TokenizeHandler as OwnedTokenizeHandler,
} from '../src/tokenizer/tokenizerContextHandler'
import type { TokenizerContextTypes as OwnedTokenizerContextTypes } from '../src/tokenizer/tokenizerContextTypes'
import type {
  TokenizerState as NamespaceTokenizerState,
  TokenizerState as OwnedTokenizerState,
} from '../src/tokenizer/tokenizerState'
import type { TokenTypes as OwnedTokenTypes } from '../src/tokenizer/tokenTypes'
import type { ConstructTreeContextTypes as OwnedConstructTreeContextTypes } from '../src/treeBuilder/constructTreeContextTypes'
import type {
  ConstructTreeHandler as NamespaceConstructTreeHandler,
  ConstructTreeHandler as OwnedConstructTreeHandler,
} from '../src/treeBuilder/constructTreeHandler'
import type {
  ConstructTreeContext as NamespaceConstructTreeContext,
  ConstructTreeNodeMap as NamespaceConstructTreeNodeMap,
  ConstructTreeState as NamespaceConstructTreeState,
  ConstructTreeContext as OwnedConstructTreeContext,
  ConstructTreeNodeMap as OwnedConstructTreeNodeMap,
  ConstructTreeState as OwnedConstructTreeState,
} from '../src/treeBuilder/constructTreeState'
import type {
  AnyContextualNode as NamespaceAnyContextualNode,
  ContextualAttributeNode as NamespaceContextualAttributeNode,
  ContextualCDATANode as NamespaceContextualCDATANode,
  ContextualCommentNode as NamespaceContextualCommentNode,
  ContextualDoctypeAttributeNode as NamespaceContextualDoctypeAttributeNode,
  ContextualDoctypeNode as NamespaceContextualDoctypeNode,
  ContextualDocumentNode as NamespaceContextualDocumentNode,
  ContextualElementNode as NamespaceContextualElementNode,
  ContextualNode as NamespaceContextualNode,
  ContextualXMLDeclarationAttributeNode as NamespaceContextualXMLDeclarationAttributeNode,
  ContextualXMLDeclarationNode as NamespaceContextualXMLDeclarationNode,
  PartialBy as NamespacePartialBy,
  AnyContextualNode as OwnedAnyContextualNode,
  ContextualAttributeNode as OwnedContextualAttributeNode,
  ContextualCDATANode as OwnedContextualCDATANode,
  ContextualCommentNode as OwnedContextualCommentNode,
  ContextualDoctypeAttributeNode as OwnedContextualDoctypeAttributeNode,
  ContextualDoctypeNode as OwnedContextualDoctypeNode,
  ContextualDocumentNode as OwnedContextualDocumentNode,
  ContextualElementNode as OwnedContextualElementNode,
  ContextualNode as OwnedContextualNode,
  ContextualXMLDeclarationAttributeNode as OwnedContextualXMLDeclarationAttributeNode,
  ContextualXMLDeclarationNode as OwnedContextualXMLDeclarationNode,
  PartialBy as OwnedPartialBy,
} from '../src/treeBuilder/contextualNode'

type PublicTypes = {
  ParseError: Public.ParseError
  ASTVisitor: Public.ASTVisitor
  BaseNode: Public.BaseNode
  SimpleNode: Public.SimpleNode<Public.NodeTypes.Text>
  TextNode: Public.TextNode
  CDATANode: Public.CDATANode
  ESLintComment: Public.ESLintComment
  AttributeKeyNode: Public.AttributeKeyNode
  AttributeValueNode: Public.AttributeValueNode
  AttributeNode: Public.AttributeNode
  CommentNode: Public.CommentNode
  DoctypeAttributeValueNode: Public.DoctypeAttributeValueNode
  DoctypeAttributeNode: Public.DoctypeAttributeNode
  DoctypeNode: Public.DoctypeNode
  ElementNode: Public.ElementNode
  ProcessingInstructionNode: Public.ProcessingInstructionNode
  XMLDeclarationAttributeKeyNode: Public.XMLDeclarationAttributeKeyNode
  XMLDeclarationAttributeValueNode: Public.XMLDeclarationAttributeValueNode
  XMLDeclarationAttributeNode: Public.XMLDeclarationAttributeNode
  XMLDeclarationNode: Public.XMLDeclarationNode
  ErrorNode: Public.ErrorNode
  DocumentChildNode: Public.DocumentChildNode
  ElementChildNode: Public.ElementChildNode
  Program: Public.Program
  DocumentNode: Public.DocumentNode
  AnyNode: Public.AnyNode
  AnyToken: Public.AnyToken
  Token: Public.Token<Public.TokenTypes.Text>
  Locations: Public.Locations
  Position: Public.Position
  Range: Public.Range
  SourceLocation: Public.SourceLocation
  Options: Public.Options
  SVGParserServices: Public.SVGParserServices
  ParseForESLintResult: Public.ParseForESLintResult
  ParseResult: Public.ParseResult
  ParseErrorType: Public.ParseErrorType
  ParseDiagnostic: Public.ParseDiagnostic
  ErrorContext: Public.ErrorContext
  SVGNodeMap: Public.SVGNodeMap
  SVGRuleNodeMap: Public.SVGRuleNodeMap
  SVGRuleListener: Public.SVGRuleListener
  SVGSourceCode: Public.SVGSourceCode
  SVGRuleContext: Public.SVGRuleContext
  SVGRuleModule: Public.SVGRuleModule
  SVGRuleNodeType: Public.SVGRuleNodeType
  AnyContextualNode: Public.AnyContextualNode
  ContextualAttributeNode: Public.ContextualAttributeNode
  ContextualCDATANode: Public.ContextualCDATANode
  ContextualCommentNode: Public.ContextualCommentNode
  ContextualDoctypeAttributeNode: Public.ContextualDoctypeAttributeNode
  ContextualDoctypeNode: Public.ContextualDoctypeNode
  ContextualDocumentNode: Public.ContextualDocumentNode
  ContextualNode: Public.ContextualNode<Public.ElementNode, never>
  ContextualElementNode: Public.ContextualElementNode
  ContextualXMLDeclarationAttributeNode: Public.ContextualXMLDeclarationAttributeNode
  ContextualXMLDeclarationNode: Public.ContextualXMLDeclarationNode
  PartialBy: Public.PartialBy<Public.ElementNode, 'name'>
  TokenizerState: Public.TokenizerState
  ConstructTreeNodeMap: Public.ConstructTreeNodeMap
  ConstructTreeContext: Public.ConstructTreeContext
  ConstructTreeState: Public.ConstructTreeState
  ConstructTreeHandler: Public.ConstructTreeHandler
  TokenizeHandler: Public.TokenizeHandler
  NodeTypes: Public.NodeTypes
  TokenTypes: Public.TokenTypes
  TokenizerContextTypes: Public.TokenizerContextTypes
  ConstructTreeContextTypes: Public.ConstructTreeContextTypes
}
type OwnedTypes = {
  ParseError: OwnedParseError
  ASTVisitor: OwnedASTVisitor
  BaseNode: OwnedBaseNode
  SimpleNode: OwnedSimpleNode<Public.NodeTypes.Text>
  TextNode: OwnedTextNode
  CDATANode: OwnedCDATANode
  ESLintComment: OwnedESLintComment
  AttributeKeyNode: OwnedAttributeKeyNode
  AttributeValueNode: OwnedAttributeValueNode
  AttributeNode: OwnedAttributeNode
  CommentNode: OwnedCommentNode
  DoctypeAttributeValueNode: OwnedDoctypeAttributeValueNode
  DoctypeAttributeNode: OwnedDoctypeAttributeNode
  DoctypeNode: OwnedDoctypeNode
  ElementNode: OwnedElementNode
  ProcessingInstructionNode: OwnedProcessingInstructionNode
  XMLDeclarationAttributeKeyNode: OwnedXMLDeclarationAttributeKeyNode
  XMLDeclarationAttributeValueNode: OwnedXMLDeclarationAttributeValueNode
  XMLDeclarationAttributeNode: OwnedXMLDeclarationAttributeNode
  XMLDeclarationNode: OwnedXMLDeclarationNode
  ErrorNode: OwnedErrorNode
  DocumentChildNode: OwnedDocumentChildNode
  ElementChildNode: OwnedElementChildNode
  Program: OwnedProgram
  DocumentNode: OwnedDocumentNode
  AnyNode: OwnedAnyNode
  AnyToken: OwnedAnyToken
  Token: OwnedToken<Public.TokenTypes.Text>
  Locations: OwnedLocations
  Position: OwnedPosition
  Range: OwnedRange
  SourceLocation: OwnedSourceLocation
  Options: OwnedOptions
  SVGParserServices: OwnedSVGParserServices
  ParseForESLintResult: OwnedParseForESLintResult
  ParseResult: OwnedParseResult
  ParseErrorType: OwnedParseErrorType
  ParseDiagnostic: OwnedParseDiagnostic
  ErrorContext: OwnedErrorContext
  SVGNodeMap: OwnedSVGNodeMap
  SVGRuleNodeMap: OwnedSVGRuleNodeMap
  SVGRuleListener: OwnedSVGRuleListener
  SVGSourceCode: OwnedSVGSourceCode
  SVGRuleContext: OwnedSVGRuleContext
  SVGRuleModule: OwnedSVGRuleModule
  SVGRuleNodeType: OwnedSVGRuleNodeType
  AnyContextualNode: OwnedAnyContextualNode
  ContextualAttributeNode: OwnedContextualAttributeNode
  ContextualCDATANode: OwnedContextualCDATANode
  ContextualCommentNode: OwnedContextualCommentNode
  ContextualDoctypeAttributeNode: OwnedContextualDoctypeAttributeNode
  ContextualDoctypeNode: OwnedContextualDoctypeNode
  ContextualDocumentNode: OwnedContextualDocumentNode
  ContextualNode: OwnedContextualNode<Public.ElementNode, never>
  ContextualElementNode: OwnedContextualElementNode
  ContextualXMLDeclarationAttributeNode: OwnedContextualXMLDeclarationAttributeNode
  ContextualXMLDeclarationNode: OwnedContextualXMLDeclarationNode
  PartialBy: OwnedPartialBy<Public.ElementNode, 'name'>
  TokenizerState: OwnedTokenizerState
  ConstructTreeNodeMap: OwnedConstructTreeNodeMap
  ConstructTreeContext: OwnedConstructTreeContext
  ConstructTreeState: OwnedConstructTreeState
  ConstructTreeHandler: OwnedConstructTreeHandler
  TokenizeHandler: OwnedTokenizeHandler
  NodeTypes: OwnedNodeTypes
  TokenTypes: OwnedTokenTypes
  TokenizerContextTypes: OwnedTokenizerContextTypes
  ConstructTreeContextTypes: OwnedConstructTreeContextTypes
}
type LegacyNamespace = {
  BaseNode: Public.AST.BaseNode
  SimpleNode: Public.AST.SimpleNode<Public.NodeTypes.Text>
  TextNode: Public.AST.TextNode
  CDATANode: Public.AST.CDATANode
  ESLintComment: Public.AST.ESLintComment
  AttributeKeyNode: Public.AST.AttributeKeyNode
  AttributeValueNode: Public.AST.AttributeValueNode
  AttributeNode: Public.AST.AttributeNode
  CommentNode: Public.AST.CommentNode
  DoctypeAttributeValueNode: Public.AST.DoctypeAttributeValueNode
  DoctypeAttributeNode: Public.AST.DoctypeAttributeNode
  DoctypeNode: Public.AST.DoctypeNode
  ElementNode: Public.AST.ElementNode
  ProcessingInstructionNode: Public.AST.ProcessingInstructionNode
  XMLDeclarationAttributeKeyNode: Public.AST.XMLDeclarationAttributeKeyNode
  XMLDeclarationAttributeValueNode: Public.AST.XMLDeclarationAttributeValueNode
  XMLDeclarationAttributeNode: Public.AST.XMLDeclarationAttributeNode
  XMLDeclarationNode: Public.AST.XMLDeclarationNode
  ErrorNode: Public.AST.ErrorNode
  DocumentChildNode: Public.AST.DocumentChildNode
  ElementChildNode: Public.AST.ElementChildNode
  Program: Public.AST.Program
  DocumentNode: Public.AST.DocumentNode
  AnyNode: Public.AST.AnyNode
  AnyToken: Public.AST.AnyToken
  Token: Public.AST.Token<Public.TokenTypes.Text>
  Locations: Public.AST.Locations
  Position: Public.AST.Position
  Range: Public.AST.Range
  SourceLocation: Public.AST.SourceLocation
  Options: Public.AST.Options
  SVGParserServices: Public.AST.SVGParserServices
  ParseForESLintResult: Public.AST.ParseForESLintResult
  ParseResult: Public.AST.ParseResult
  ParseErrorType: Public.AST.ParseErrorType
  ParseDiagnostic: Public.AST.ParseDiagnostic
  ParseError: Public.AST.ParseError
  ErrorContext: Public.AST.ErrorContext
  SVGNodeMap: Public.AST.SVGNodeMap
  SVGRuleNodeMap: Public.AST.SVGRuleNodeMap
  SVGRuleListener: Public.AST.SVGRuleListener
  SVGSourceCode: Public.AST.SVGSourceCode
  SVGRuleContext: Public.AST.SVGRuleContext
  SVGRuleModule: Public.AST.SVGRuleModule
  SVGRuleNodeType: Public.AST.SVGRuleNodeType
  AnyContextualNode: Public.AST.AnyContextualNode
  ContextualAttributeNode: Public.AST.ContextualAttributeNode
  ContextualCDATANode: Public.AST.ContextualCDATANode
  ContextualCommentNode: Public.AST.ContextualCommentNode
  ContextualDoctypeAttributeNode: Public.AST.ContextualDoctypeAttributeNode
  ContextualDoctypeNode: Public.AST.ContextualDoctypeNode
  ContextualDocumentNode: Public.AST.ContextualDocumentNode
  ContextualNode: Public.AST.ContextualNode<Public.ElementNode, never>
  ContextualElementNode: Public.AST.ContextualElementNode
  ContextualXMLDeclarationAttributeNode: Public.AST.ContextualXMLDeclarationAttributeNode
  ContextualXMLDeclarationNode: Public.AST.ContextualXMLDeclarationNode
  PartialBy: Public.AST.PartialBy<Public.ElementNode, 'name'>
  TokenizerState: Public.AST.TokenizerState
  ConstructTreeNodeMap: Public.AST.ConstructTreeNodeMap
  ConstructTreeContext: Public.AST.ConstructTreeContext
  ConstructTreeState: Public.AST.ConstructTreeState
  ConstructTreeHandler: Public.AST.ConstructTreeHandler
  TokenizeHandler: Public.AST.TokenizeHandler
}
type OwnedNamespace = {
  BaseNode: NamespaceBaseNode
  SimpleNode: NamespaceSimpleNode<Public.NodeTypes.Text>
  TextNode: NamespaceTextNode
  CDATANode: NamespaceCDATANode
  ESLintComment: NamespaceESLintComment
  AttributeKeyNode: NamespaceAttributeKeyNode
  AttributeValueNode: NamespaceAttributeValueNode
  AttributeNode: NamespaceAttributeNode
  CommentNode: NamespaceCommentNode
  DoctypeAttributeValueNode: NamespaceDoctypeAttributeValueNode
  DoctypeAttributeNode: NamespaceDoctypeAttributeNode
  DoctypeNode: NamespaceDoctypeNode
  ElementNode: NamespaceElementNode
  ProcessingInstructionNode: NamespaceProcessingInstructionNode
  XMLDeclarationAttributeKeyNode: NamespaceXMLDeclarationAttributeKeyNode
  XMLDeclarationAttributeValueNode: NamespaceXMLDeclarationAttributeValueNode
  XMLDeclarationAttributeNode: NamespaceXMLDeclarationAttributeNode
  XMLDeclarationNode: NamespaceXMLDeclarationNode
  ErrorNode: NamespaceErrorNode
  DocumentChildNode: NamespaceDocumentChildNode
  ElementChildNode: NamespaceElementChildNode
  Program: NamespaceProgram
  DocumentNode: NamespaceDocumentNode
  AnyNode: NamespaceAnyNode
  AnyToken: NamespaceAnyToken
  Token: NamespaceToken<Public.TokenTypes.Text>
  Locations: NamespaceLocations
  Position: NamespacePosition
  Range: NamespaceRange
  SourceLocation: NamespaceSourceLocation
  Options: NamespaceOptions
  SVGParserServices: NamespaceSVGParserServices
  ParseForESLintResult: NamespaceParseForESLintResult
  ParseResult: NamespaceParseResult
  ParseErrorType: NamespaceParseErrorType
  ParseDiagnostic: NamespaceParseDiagnostic
  ParseError: NamespaceParseError
  ErrorContext: NamespaceErrorContext
  SVGNodeMap: NamespaceSVGNodeMap
  SVGRuleNodeMap: NamespaceSVGRuleNodeMap
  SVGRuleListener: NamespaceSVGRuleListener
  SVGSourceCode: NamespaceSVGSourceCode
  SVGRuleContext: NamespaceSVGRuleContext
  SVGRuleModule: NamespaceSVGRuleModule
  SVGRuleNodeType: NamespaceSVGRuleNodeType
  AnyContextualNode: NamespaceAnyContextualNode
  ContextualAttributeNode: NamespaceContextualAttributeNode
  ContextualCDATANode: NamespaceContextualCDATANode
  ContextualCommentNode: NamespaceContextualCommentNode
  ContextualDoctypeAttributeNode: NamespaceContextualDoctypeAttributeNode
  ContextualDoctypeNode: NamespaceContextualDoctypeNode
  ContextualDocumentNode: NamespaceContextualDocumentNode
  ContextualNode: NamespaceContextualNode<Public.ElementNode, never>
  ContextualElementNode: NamespaceContextualElementNode
  ContextualXMLDeclarationAttributeNode: NamespaceContextualXMLDeclarationAttributeNode
  ContextualXMLDeclarationNode: NamespaceContextualXMLDeclarationNode
  PartialBy: NamespacePartialBy<Public.ElementNode, 'name'>
  TokenizerState: NamespaceTokenizerState
  ConstructTreeNodeMap: NamespaceConstructTreeNodeMap
  ConstructTreeContext: NamespaceConstructTreeContext
  ConstructTreeState: NamespaceConstructTreeState
  ConstructTreeHandler: NamespaceConstructTreeHandler
  TokenizeHandler: NamespaceTokenizeHandler
}

describe('public type exports', () => {
  it('retains all existing root types as aliases of their owning definitions', () => {
    expectTypeOf<PublicTypes>().toEqualTypeOf<OwnedTypes>()
  })

  it('preserves the complete AST compatibility namespace, including legacy diagnostics', () => {
    expectTypeOf<LegacyNamespace>().toEqualTypeOf<OwnedNamespace>()
  })
})
