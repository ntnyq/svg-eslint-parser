import type { TokenTypes } from '../../constants'
import type { Locations } from './common'

/**
 * token
 */
export interface Token<T extends TokenTypes> extends Locations {
  /**
   * node type
   */
  type: T
  /**
   * token value
   */
  value: string
}

/**
 * any token
 */
export type AnyToken =
  | Token<TokenTypes.Attribute>
  | Token<TokenTypes.AttributeAssignment>
  | Token<TokenTypes.AttributeKey>
  | Token<TokenTypes.AttributeValue>
  | Token<TokenTypes.AttributeValueWrapperEnd>
  | Token<TokenTypes.AttributeValueWrapperStart>
  | Token<TokenTypes.CloseTag>
  | Token<TokenTypes.Comment>
  | Token<TokenTypes.CommentClose>
  | Token<TokenTypes.CommentContent>
  | Token<TokenTypes.CommentOpen>
  | Token<TokenTypes.Doctype>
  | Token<TokenTypes.DoctypeAttributeValue>
  | Token<TokenTypes.DoctypeAttributeWrapperEnd>
  | Token<TokenTypes.DoctypeAttributeWrapperStart>
  | Token<TokenTypes.DoctypeClose>
  | Token<TokenTypes.DoctypeOpen>
  | Token<TokenTypes.Document>
  | Token<TokenTypes.OpenTagEnd>
  | Token<TokenTypes.OpenTagStart>
  | Token<TokenTypes.Program>
  | Token<TokenTypes.Tag>
  | Token<TokenTypes.Text>
