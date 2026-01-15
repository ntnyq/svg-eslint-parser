export enum TokenTypes {
  /**
   * @pg Content tokens
   */
  Text = 'Text',

  /**
   * @pg Attribute tokens
   */
  AttributeAssignment = 'AttributeAssignment',
  AttributeKey = 'AttributeKey',
  AttributeValue = 'AttributeValue',
  AttributeValueWrapperEnd = 'AttributeValueWrapperEnd',
  AttributeValueWrapperStart = 'AttributeValueWrapperStart',

  /**
   * @pg Doctype tokens
   */
  DoctypeAttributeValue = 'DoctypeAttributeValue',
  DoctypeAttributeWrapperEnd = 'DoctypeAttributeWrapperEnd',
  DoctypeAttributeWrapperStart = 'DoctypeAttributeWrapperStart',
  DoctypeClose = 'DoctypeClose',
  DoctypeOpen = 'DoctypeOpen',

  /**
   * @pg Tag tokens
   */
  CloseTag = 'CloseTag',
  OpenTagEnd = 'OpenTagEnd',
  OpenTagStart = 'OpenTagStart',

  /**
   * @pg Comment tokens
   */
  CommentClose = 'CommentClose',
  CommentContent = 'CommentContent',
  CommentOpen = 'CommentOpen',

  /**
   * @pg XML Declaration tokens
   */
  XMLDeclarationAttributeAssignment = 'XMLDeclarationAttributeAssignment',
  XMLDeclarationAttributeKey = 'XMLDeclarationAttributeKey',
  XMLDeclarationAttributeValue = 'XMLDeclarationAttributeValue',
  XMLDeclarationAttributeValueWrapperEnd = 'XMLDeclarationAttributeValueWrapperEnd',
  XMLDeclarationAttributeValueWrapperStart = 'XMLDeclarationAttributeValueWrapperStart',
  XMLDeclarationClose = 'XMLDeclarationClose',
  XMLDeclarationOpen = 'XMLDeclarationOpen',
}
