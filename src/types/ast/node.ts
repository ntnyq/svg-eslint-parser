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

/**
 * attribute nodes
 * @pg
 */
export type AttributeKeyNode = SimpleNode<NodeTypes.AttributeKey>
export type AttributeValueNode = SimpleNode<NodeTypes.AttributeValue>
export interface AttributeNode extends BaseNode {
  key: AttributeKeyNode
  type: NodeTypes.Attribute
  value: AttributeValueNode
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
 * tag nodes
 * @pg
 */
export interface TagNode extends BaseNode {
  attributes: AttributeNode[]
  children: NestableNode[]
  name: string
  selfClosing: boolean
  type: NodeTypes.Tag
}

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
  value: XMLDeclarationAttributeValueNode
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
 * nestable node
 * @pg
 */
export type NestableNode =
  | CommentNode
  | DoctypeNode
  | TagNode
  | TextNode
  | XMLDeclarationNode

/**
 * program
 * @pg
 */
export interface Program extends BaseNode {
  body: DocumentNode[]
  comments: string[]
  tokens: AnyToken[]
  type: NodeTypes.Program
}

export interface DocumentNode extends BaseNode {
  children: NestableNode[]
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
  | ErrorNode
  | Program
  | TagNode
  | TextNode
  | XMLDeclarationAttributeKeyNode
  | XMLDeclarationAttributeNode
  | XMLDeclarationAttributeValueNode
  | XMLDeclarationNode

// Internal extensions for handler compatibility
declare global {
  namespace AST {}
}
