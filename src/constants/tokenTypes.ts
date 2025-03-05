export enum TokenTypes {
  Attribute = 'Attribute',
  AttributeAssignment = 'AttributeAssignment',
  AttributeKey = 'AttributeKey',

  AttributeValue = 'AttributeValue',
  AttributeValueWrapperEnd = 'AttributeValueWrapperEnd',
  AttributeValueWrapperStart = 'AttributeValueWrapperStart',
  CloseTag = 'CloseTag',
  Comment = 'Comment',
  CommentClose = 'CommentClose',
  CommentContent = 'CommentContent',
  CommentOpen = 'CommentOpen',

  Doctype = 'Doctype',
  DoctypeAttributeValue = 'DoctypeAttributeValue',
  DoctypeAttributeWrapperEnd = 'DoctypeAttributeWrapperEnd',
  DoctypeAttributeWrapperStart = 'DoctypeAttributeWrapperStart',
  DoctypeClose = 'DoctypeClose',
  DoctypeOpen = 'DoctypeOpen',

  Document = 'Document',
  OpenTagEnd = 'OpenTagEnd',
  OpenTagStart = 'OpenTagStart',
  Program = 'Program',

  Tag = 'Tag',
  Text = 'Text',
  XMLDeclarationAttribute = 'XMLDeclarationAttribute',
  XMLDeclarationAttributeAssignment = 'XMLDeclarationAttributeAssignment',

  XMLDeclarationAttributeKey = 'XMLDeclarationAttributeKey',
  XMLDeclarationAttributeValue = 'XMLDeclarationAttributeValue',
  XMLDeclarationAttributeValueWrapperEnd = 'XMLDeclarationAttributeValueWrapperEnd',
  XMLDeclarationAttributeValueWrapperStart = 'XMLDeclarationAttributeValueWrapperStart',
  XMLDeclarationClose = 'XMLDeclarationClose',
  XMLDeclarationOpen = 'XMLDeclarationOpen',
}
