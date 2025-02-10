import type { NodeTypes } from '../../constants'
import type { Locations } from './common'
import type { AnyToken } from './token'

/**
 * any node
 */
export type AnyNode =
  | AttributeKeyNode
  | AttributeNode
  | AttributeValueNode
  | AttributeValueWrapperEndNode
  | AttributeValueWrapperStartNode
  | CloseTagNode
  | CommentCloseNode
  | CommentContentNode
  | CommentNode
  | CommentOpenNode
  | DoctypeAttributeNode
  | DoctypeAttributeValueNode
  | DoctypeAttributeWrapperEndNode
  | DoctypeAttributeWrapperStartNode
  | DoctypeCloseNode
  | DoctypeNode
  | DoctypeOpenNode
  | DocumentNode
  | LiteralNode
  | OpenTagEndNode
  | OpenTagStartNode
  | Program
  | TagNode
  | TextNode
  | XMLDeclarationAttributeNode
  | XMLDeclarationNode

/**
 * attribute
 */
export type AttributeKeyNode = SimpleNode<NodeTypes.AttributeKey>

export interface AttributeNode extends BaseNode {
  key: AttributeKeyNode
  type: NodeTypes.Attribute
  value: AttributeValueNode
  endWrapper?: AttributeValueWrapperEndNode
  startWrapper?: AttributeValueWrapperStartNode
}

export type AttributeValueNode = SimpleNode<NodeTypes.AttributeValue>
export type AttributeValueWrapperEndNode =
  SimpleNode<NodeTypes.AttributeValueWrapperEnd>

export type AttributeValueWrapperStartNode =
  SimpleNode<NodeTypes.AttributeValueWrapperStart>
export interface BaseNode extends Locations {
  type: NodeTypes
}
/**
 * tag
 */
export type CloseTagNode = SimpleNode<NodeTypes.CloseTag>
/**
 * comment
 */
export type CommentCloseNode = SimpleNode<NodeTypes.CommentClose>
export type CommentContentNode = SimpleNode<NodeTypes.CommentContent>

export interface CommentNode extends BaseNode {
  close: CommentCloseNode
  open: CommentOpenNode
  type: NodeTypes.Comment
  value: CommentContentNode
}
export type CommentOpenNode = SimpleNode<NodeTypes.CommentOpen>
/**
 * doctype
 */
export interface DoctypeAttributeNode extends BaseNode {
  type: NodeTypes.DoctypeAttribute
  endWrapper?: DoctypeAttributeWrapperEndNode
  startWrapper?: DoctypeAttributeWrapperStartNode
  value?: DoctypeAttributeValueNode
}
export type DoctypeAttributeValueNode =
  SimpleNode<NodeTypes.DoctypeAttributeValue>

export type DoctypeAttributeWrapperEndNode =
  SimpleNode<NodeTypes.DoctypeAttributeWrapperEnd>
export type DoctypeAttributeWrapperStartNode =
  SimpleNode<NodeTypes.DoctypeAttributeWrapperStart>
export type DoctypeCloseNode = SimpleNode<NodeTypes.DoctypeClose>
export interface DoctypeNode extends BaseNode {
  attributes: DoctypeAttributeNode[]
  close: DoctypeCloseNode
  open: DoctypeOpenNode
  type: NodeTypes.Doctype
}
export type DoctypeOpenNode = SimpleNode<NodeTypes.DoctypeOpen>
export interface DocumentNode extends BaseNode {
  children: NestableNode[]
  type: NodeTypes.Document
}
/**
 * literal node
 */
export type LiteralNode = SimpleNode<NodeTypes.Literal> & {
  raw: string
}

/**
 * nestable node
 */
export type NestableNode = CommentNode | TagNode | TextNode | XMLDeclarationNode
export type OpenTagEndNode = SimpleNode<NodeTypes.OpenTagEnd>

export type OpenTagStartNode = SimpleNode<NodeTypes.OpenTagStart>
/**
 * program
 */
export interface Program extends BaseNode {
  body: DocumentNode[]
  comments: CommentContentNode[]
  tokens: AnyToken[]
  type: NodeTypes.Program
}
export interface SimpleNode<T extends NodeTypes> extends BaseNode {
  type: T
  value: string
}
export interface TagNode extends BaseNode {
  attributes: AttributeNode[]
  children: NestableNode[]
  name: string
  openEnd: OpenTagEndNode
  openStart: OpenTagStartNode
  selfClosing: boolean
  type: NodeTypes.Tag
  close?: CloseTagNode
}

export type TextNode = SimpleNode<NodeTypes.Text>

/**
 * XML declaration
 */
export interface XMLDeclarationAttributeNode extends BaseNode {
  key: LiteralNode
  type: NodeTypes.XMLDeclarationAttribute
  value: LiteralNode
}

export interface XMLDeclarationNode extends BaseNode {
  attributes: XMLDeclarationAttributeNode[]
  close: LiteralNode
  open: LiteralNode
  type: NodeTypes.XMLDeclaration
}
