import type { NodeTypes } from '../../constants'
import type { Locations } from './common'
import type { AnyToken } from './token'

export interface BaseNode extends Locations {
  type: NodeTypes
}

export interface SimpleNode<T extends NodeTypes> extends BaseNode {
  type: T
  value: string
}

export type TextNode = SimpleNode<NodeTypes.Text>

// ESLint expects comments to be plain objects with loc/range
export interface ESLintComment extends Locations {
  type: 'Block' | 'Line'
  value: string
}

/**
 * attribute nodes
 * @pg
 */
export type AttributeKeyNode = SimpleNode<NodeTypes.AttributeKey>
export type AttributeValueNode = SimpleNode<NodeTypes.AttributeValue>
export interface AttributeNode extends BaseNode {
  key: AttributeKeyNode
  type: NodeTypes.Attribute
  value?: AttributeValueNode
  quoteChar?: '"' | "'" | undefined
}

/**
 * comment nodes
 * @pg
 */
export interface CommentNode extends BaseNode {
  content: string
  type: NodeTypes.Comment
}

/**
 * doctype nodes
 * @pg
 */
export type DoctypeAttributeValueNode =
  SimpleNode<NodeTypes.DoctypeAttributeValue>
export interface DoctypeAttributeNode extends BaseNode {
  type: NodeTypes.DoctypeAttribute
  quoteChar?: '"' | "'" | undefined
  value?: DoctypeAttributeValueNode
}
export interface DoctypeNode extends BaseNode {
  attributes: DoctypeAttributeNode[]
  type: NodeTypes.Doctype
}

/**
 * element nodes
 * @pg
 */
export interface ElementNode extends BaseNode {
  attributes: AttributeNode[]
  children: ElementChildNode[]
  name: string
  selfClosing: boolean
  type: NodeTypes.Element
}

/** @deprecated Use ElementNode instead. */
export type TagNode = ElementNode

/**
 * XML declaration nodes
 */
export type XMLDeclarationAttributeKeyNode =
  SimpleNode<NodeTypes.XMLDeclarationAttributeKey>
export type XMLDeclarationAttributeValueNode =
  SimpleNode<NodeTypes.XMLDeclarationAttributeValue>
export interface XMLDeclarationAttributeNode extends BaseNode {
  key: XMLDeclarationAttributeKeyNode
  type: NodeTypes.XMLDeclarationAttribute
  value?: XMLDeclarationAttributeValueNode
  quoteChar?: '"' | "'" | undefined
}
export interface XMLDeclarationNode extends BaseNode {
  attributes: XMLDeclarationAttributeNode[]
  type: NodeTypes.XMLDeclaration
}

/**
 * error nodes
 * @pg
 */
export interface ErrorNode extends BaseNode {
  code: string
  message: string
  type: NodeTypes.Error
  recoveredNode?: AnyNode
}

/**
 * child node
 * @pg
 */
export type DocumentChildNode =
  | XMLDeclarationNode
  | DoctypeNode
  | ElementNode
  | CommentNode
  | TextNode

export type ElementChildNode = ElementNode | CommentNode | TextNode

/**
 * program
 * @pg
 */
export interface Program extends BaseNode {
  body: []
  comments: ESLintComment[]
  document: DocumentNode
  tokens: AnyToken[]
  type: NodeTypes.Program
}

export interface DocumentNode extends BaseNode {
  children: DocumentChildNode[]
  type: NodeTypes.Document
}

/**
 * any node
 * @pg
 */
export type AnyNode =
  | AttributeKeyNode
  | AttributeNode
  | AttributeValueNode
  | CommentNode
  | DoctypeAttributeNode
  | DoctypeAttributeValueNode
  | DoctypeNode
  | DocumentNode
  | ElementNode
  | ErrorNode
  | Program
  | TextNode
  | XMLDeclarationAttributeKeyNode
  | XMLDeclarationAttributeNode
  | XMLDeclarationAttributeValueNode
  | XMLDeclarationNode
