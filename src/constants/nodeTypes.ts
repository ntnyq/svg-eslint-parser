export enum NodeTypes {
  Attribute = 'Attribute',
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

  DoctypeAttribute = 'DoctypeAttribute',
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
  XMLDeclaration = 'XMLDeclaration',
  XMLDeclarationAttribute = 'XMLDeclarationAttribute',
  XMLDeclarationAttributeKey = 'XMLDeclarationAttributeKey',

  XMLDeclarationAttributeValue = 'XMLDeclarationAttributeValue',
  XMLDeclarationAttributeValueWrapperEnd = 'XMLDeclarationAttributeValueWrapperEnd',
  XMLDeclarationAttributeValueWrapperStart = 'XMLDeclarationAttributeValueWrapperStart',
  XMLDeclarationClose = 'XMLDeclarationClose',
  XMLDeclarationOpen = 'XMLDeclarationOpen',
}
