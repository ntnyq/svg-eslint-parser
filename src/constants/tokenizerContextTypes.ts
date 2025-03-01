export enum TokenizerContextTypes {
  AttributeKey = 'AttributeKey',

  Attributes = 'Attributes',
  AttributeValue = 'AttributeValue',
  AttributeValueBare = 'AttributeValueBare',

  AttributeValueWrapped = 'AttributeValueWrapped',
  CloseTag = 'CloseTag',
  CommentClose = 'CommentClose',
  CommentContent = 'CommentContent',
  CommentOpen = 'CommentOpen',
  Data = 'Data',

  DoctypeAttributeBare = 'DoctypeAttributeBare',
  DoctypeAttributes = 'DoctypeAttributes',
  DoctypeAttributeWrapped = 'DoctypeAttributeWrapped',
  DoctypeClose = 'DoctypeClose',
  DoctypeOpen = 'DoctypeOpen',

  OpenTagEnd = 'OpenTagEnd',
  OpenTagStart = 'OpenTagStart',
  XMLDeclarationAttributeKey = 'XMLDeclarationAttributeKey',

  XMLDeclarationAttributes = 'XMLDeclarationAttributes',
  XMLDeclarationAttributeValue = 'XMLDeclarationAttributeValue',
  XMLDeclarationAttributeValueWrapped = 'XMLDeclarationAttributeValueWrapped',
  XMLDeclarationClose = 'XMLDeclarationClose',
  XMLDeclarationOpen = 'XMLDeclarationOpen',
}
