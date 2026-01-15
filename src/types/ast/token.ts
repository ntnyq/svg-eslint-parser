import type { TokenTypes } from '../../constants'
import type { Locations } from './common'

/**
 * any token
 */
export type AnyToken =
  | Token<TokenTypes.AttributeAssignment>
  | Token<TokenTypes.AttributeKey>
  | Token<TokenTypes.AttributeValue>
  | Token<TokenTypes.AttributeValueWrapperEnd>
  | Token<TokenTypes.AttributeValueWrapperStart>
  | Token<TokenTypes.CloseTag>
  | Token<TokenTypes.CommentClose>
  | Token<TokenTypes.CommentContent>
  | Token<TokenTypes.CommentOpen>
  | Token<TokenTypes.DoctypeAttributeValue>
  | Token<TokenTypes.DoctypeAttributeWrapperEnd>
  | Token<TokenTypes.DoctypeAttributeWrapperStart>
  | Token<TokenTypes.DoctypeClose>
  | Token<TokenTypes.DoctypeOpen>
  | Token<TokenTypes.OpenTagEnd>
  | Token<TokenTypes.OpenTagStart>
  | Token<TokenTypes.Text>
  | Token<TokenTypes.XMLDeclarationAttributeAssignment>
  | Token<TokenTypes.XMLDeclarationAttributeKey>
  | Token<TokenTypes.XMLDeclarationAttributeValue>
  | Token<TokenTypes.XMLDeclarationAttributeValueWrapperEnd>
  | Token<TokenTypes.XMLDeclarationAttributeValueWrapperStart>
  | Token<TokenTypes.XMLDeclarationClose>
  | Token<TokenTypes.XMLDeclarationOpen>

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
