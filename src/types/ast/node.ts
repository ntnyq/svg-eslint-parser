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
export interface DocumentNode extends BaseNode {
  children: NestableNode[]
  type: NodeTypes.Document
}

export interface Program extends BaseNode {
  body: DocumentNode[]
  comments: string[]
  tokens: AnyToken[]
  type: NodeTypes.Program
}

/**
 * any node
 * @pg
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
  | ErrorNode
  | OpenTagEndNode
  | OpenTagStartNode
  | Program
  | TagNode
  | TextNode
  | XMLDeclarationAttributeKeyNode
  | XMLDeclarationAttributeNode
  | XMLDeclarationAttributeValueNode
  | XMLDeclarationAttributeValueWrapperEndNode
  | XMLDeclarationAttributeValueWrapperStartNode
  | XMLDeclarationCloseNode
  | XMLDeclarationNode
  | XMLDeclarationOpenNode

/**
 * @deprecated Legacy wrapper nodes (internal use only)
 */
export type AttributeValueWrapperEndNode =
  SimpleNode<NodeTypes.AttributeValueWrapperEnd>
/**
 * @deprecated Legacy wrapper nodes (internal use only)
 */
export type AttributeValueWrapperStartNode =
  SimpleNode<NodeTypes.AttributeValueWrapperStart>
/**
 * @deprecated Legacy close tag nodes (internal use only)
 */
export type CloseTagNode = SimpleNode<NodeTypes.CloseTag>
/**
 * @deprecated Legacy comment nodes (internal use only)
 */
export type CommentCloseNode = SimpleNode<NodeTypes.CommentClose>
/**
 * @deprecated Legacy comment nodes (internal use only)
 */
export type CommentContentNode = SimpleNode<NodeTypes.CommentContent>
/**
 * @deprecated Legacy comment nodes (internal use only)
 */
export type CommentOpenNode = SimpleNode<NodeTypes.CommentOpen>
/**
 * @deprecated Legacy doctype wrapper nodes (internal use only)
 */
export type DoctypeAttributeWrapperEndNode =
  SimpleNode<NodeTypes.DoctypeAttributeWrapperEnd>
/**
 * @deprecated Legacy doctype wrapper nodes (internal use only)
 */
export type DoctypeAttributeWrapperStartNode =
  SimpleNode<NodeTypes.DoctypeAttributeWrapperStart>
/**
 * @deprecated Legacy doctype nodes (internal use only)
 */
export type DoctypeCloseNode = SimpleNode<NodeTypes.DoctypeClose>
/**
 * @deprecated Legacy doctype nodes (internal use only)
 */
export type DoctypeOpenNode = SimpleNode<NodeTypes.DoctypeOpen>
/**
 * @deprecated Legacy tag nodes (internal use only)
 */
export type OpenTagEndNode = SimpleNode<NodeTypes.OpenTagEnd>
/**
 * @deprecated Legacy tag nodes (internal use only)
 */
export type OpenTagStartNode = SimpleNode<NodeTypes.OpenTagStart>
/**
 * @deprecated Legacy XML declaration wrapper nodes (internal use only)
 */
export type XMLDeclarationAttributeValueWrapperEndNode =
  SimpleNode<NodeTypes.XMLDeclarationAttributeValueWrapperEnd>
/**
 * @deprecated Legacy XML declaration wrapper nodes (internal use only)
 */
export type XMLDeclarationAttributeValueWrapperStartNode =
  SimpleNode<NodeTypes.XMLDeclarationAttributeValueWrapperStart>
/**
 * @deprecated Legacy XML declaration nodes (internal use only)
 */
export type XMLDeclarationCloseNode = SimpleNode<NodeTypes.XMLDeclarationClose>
/**
 * @deprecated Legacy XML declaration nodes (internal use only)
 */
export type XMLDeclarationOpenNode = SimpleNode<NodeTypes.XMLDeclarationOpen>

// Internal extensions for handler compatibility
declare global {
  namespace AST {
    interface CommentNode {
      close?: CommentCloseNode
      open?: CommentOpenNode
      value?: CommentContentNode
    }
    interface DoctypeNode {
      close?: DoctypeCloseNode
      open?: DoctypeOpenNode
    }
    interface TagNode {
      close?: CloseTagNode
      openEnd?: OpenTagEndNode
      openStart?: OpenTagStartNode
    }
    interface AttributeNode {
      endWrapper?: AttributeValueWrapperEndNode
      startWrapper?: AttributeValueWrapperStartNode
    }
    interface DoctypeAttributeNode {
      endWrapper?: DoctypeAttributeWrapperEndNode
      startWrapper?: DoctypeAttributeWrapperStartNode
    }
    interface XMLDeclarationAttributeNode {
      endWrapper?: XMLDeclarationAttributeValueWrapperEndNode
      startWrapper?: XMLDeclarationAttributeValueWrapperStartNode
    }
  }
}
