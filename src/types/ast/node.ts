import type { NodeTypes } from '../../constants'
import type { Locations } from './common'
import type { AnyToken } from './token'

/**
 * Base shape shared by all AST nodes.
 */
export interface BaseNode extends Locations {
  type: NodeTypes
}

/**
 * Leaf AST node that stores a string value.
 */
export interface SimpleNode<T extends NodeTypes> extends BaseNode {
  type: T
  value: string
}

/**
 * Text content between SVG/XML nodes.
 */
export type TextNode = SimpleNode<NodeTypes.Text>

/**
 * Raw character data from a CDATA section.
 */
export type CDATANode = SimpleNode<NodeTypes.CDATA>

/**
 * ESLint-compatible comment object.
 */
export interface ESLintComment extends Locations {
  type: 'Block' | 'Line'
  value: string
}

/**
 * Attribute key node.
 */
export type AttributeKeyNode = SimpleNode<NodeTypes.AttributeKey>

/**
 * Attribute value node.
 */
export type AttributeValueNode = SimpleNode<NodeTypes.AttributeValue>

/**
 * Element attribute node.
 */
export interface AttributeNode extends BaseNode {
  key: AttributeKeyNode
  type: NodeTypes.Attribute
  quoteChar?: '"' | "'" | undefined
  value?: AttributeValueNode
}

/**
 * SVG/XML comment node.
 */
export interface CommentNode extends BaseNode {
  content: string
  type: NodeTypes.Comment
  value: string
}

/**
 * Doctype attribute value node.
 */
export type DoctypeAttributeValueNode =
  SimpleNode<NodeTypes.DoctypeAttributeValue>

/**
 * Doctype attribute node.
 */
export interface DoctypeAttributeNode extends BaseNode {
  type: NodeTypes.DoctypeAttribute
  quoteChar?: '"' | "'" | undefined
  value?: DoctypeAttributeValueNode
}
/**
 * Doctype declaration node.
 */
export interface DoctypeNode extends BaseNode {
  attributes: DoctypeAttributeNode[]
  type: NodeTypes.Doctype
}

/**
 * SVG/XML element node.
 */
export interface ElementNode extends BaseNode {
  attributes: AttributeNode[]
  children: ElementChildNode[]
  name: string
  selfClosing: boolean
  type: NodeTypes.Element
}

/**
 * XML processing instruction.
 */
export interface ProcessingInstructionNode extends BaseNode {
  target: string
  type: NodeTypes.ProcessingInstruction
  value: string
}

/**
 * XML declaration attribute key node.
 */
export type XMLDeclarationAttributeKeyNode =
  SimpleNode<NodeTypes.XMLDeclarationAttributeKey>

/**
 * XML declaration attribute value node.
 */
export type XMLDeclarationAttributeValueNode =
  SimpleNode<NodeTypes.XMLDeclarationAttributeValue>

/**
 * XML declaration attribute node.
 */
export interface XMLDeclarationAttributeNode extends BaseNode {
  key: XMLDeclarationAttributeKeyNode
  type: NodeTypes.XMLDeclarationAttribute
  quoteChar?: '"' | "'" | undefined
  value?: XMLDeclarationAttributeValueNode
}
/**
 * XML declaration node.
 */
export interface XMLDeclarationNode extends BaseNode {
  attributes: XMLDeclarationAttributeNode[]
  type: NodeTypes.XMLDeclaration
}

/**
 * Parser recovery error node.
 */
export interface ErrorNode extends BaseNode {
  code: string
  message: string
  type: NodeTypes.Error
  recoveredNode?: AnyNode
}

/**
 * Node types allowed as direct document children.
 */
export type DocumentChildNode =
  | CDATANode
  | CommentNode
  | DoctypeNode
  | ElementNode
  | ProcessingInstructionNode
  | TextNode
  | XMLDeclarationNode

/**
 * Node types allowed as element children.
 */
export type ElementChildNode =
  | CDATANode
  | CommentNode
  | ElementNode
  | ProcessingInstructionNode
  | TextNode

/**
 * ESLint program wrapper around the SVG document.
 */
export interface Program extends BaseNode {
  body: []
  comments: ESLintComment[]
  document: DocumentNode
  tokens: AnyToken[]
  type: NodeTypes.Program
}

/**
 * Root SVG document node.
 */
export interface DocumentNode extends BaseNode {
  children: DocumentChildNode[]
  type: NodeTypes.Document
}

/**
 * Union of every parser AST node.
 */
export type AnyNode =
  | AttributeKeyNode
  | AttributeNode
  | AttributeValueNode
  | CDATANode
  | CommentNode
  | DoctypeAttributeNode
  | DoctypeAttributeValueNode
  | DoctypeNode
  | DocumentNode
  | ElementNode
  | ErrorNode
  | ProcessingInstructionNode
  | Program
  | TextNode
  | XMLDeclarationAttributeKeyNode
  | XMLDeclarationAttributeNode
  | XMLDeclarationAttributeValueNode
  | XMLDeclarationNode
