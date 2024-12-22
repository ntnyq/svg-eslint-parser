export enum TokenTypes {
  Program = 'Program',
  Document = 'Document',
  Text = 'Text',

  Doctype = 'Doctype',
  DoctypeOpen = 'DoctypeOpen',
  DoctypeClose = 'DoctypeClose',
  DoctypeAttributeValue = 'DoctypeAttributeValue',
  DoctypeAttributeWrapperStart = 'DoctypeAttributeWrapperStart',
  DoctypeAttributeWrapperEnd = 'DoctypeAttributeWrapperEnd',

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
  AttributeAssignment = 'AttributeAssignment',
  AttributeValueWrapperStart = 'AttributeValueWrapperStart',
  AttributeValueWrapperEnd = 'AttributeValueWrapperEnd',
}
