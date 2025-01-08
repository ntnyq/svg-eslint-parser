export enum NodeTypes {
  Program = 'Program',
  Document = 'Document',
  Text = 'Text',

  XMLDeclaration = 'XMLDeclaration',
  XMLDeclarationOpen = 'XMLDeclarationOpen',
  XMLDeclarationClose = 'XMLDeclarationClose',
  XMLDeclarationAttribute = 'XMLDeclarationAttribute',
  XMLDeclarationAttributeKey = 'XMLDeclarationAttributeKey',
  XMLDeclarationAttributeValue = 'XMLDeclarationAttributeValue',
  XMLDeclarationAttributeValueWrapperStart = 'XMLDeclarationAttributeValueWrapperStart',
  XMLDeclarationAttributeValueWrapperEnd = 'XMLDeclarationAttributeValueWrapperEnd',

  Doctype = 'Doctype',
  DoctypeOpen = 'DoctypeOpen',
  DoctypeClose = 'DoctypeClose',
  DoctypeAttribute = 'DoctypeAttribute',
  DoctypeAttributeValue = 'DoctypeAttributeValue',
  DoctypeAttributeWrapperEnd = 'DoctypeAttributeWrapperEnd',
  DoctypeAttributeWrapperStart = 'DoctypeAttributeWrapperStart',

  Tag = 'Tag',
  OpenTagStart = 'OpenTagStart',
  OpenTagEnd = 'OpenTagEnd',
  CloseTag = 'CloseTag',

  Comment = 'Comment',
  CommentOpen = 'CommentOpen',
  CommentClose = 'CommentClose',
  CommentContent = 'CommentContent',

  Attribute = 'Attribute',
  AttributeKey = 'AttributeKey',
  AttributeValue = 'AttributeValue',
  AttributeValueWrapperStart = 'AttributeValueWrapperStart',
  AttributeValueWrapperEnd = 'AttributeValueWrapperEnd',
}
