export enum TokenizerContextTypes {
  Data = 'Data',

  OpenTagStart = 'OpenTagStart',
  OpenTagEnd = 'OpenTagEnd',
  CloseTag = 'CloseTag',

  Attributes = 'Attributes',
  AttributeKey = 'AttributeKey',
  AttributeValue = 'AttributeValue',
  AttributeValueBare = 'AttributeValueBare',
  AttributeValueWrapped = 'AttributeValueWrapped',

  CommentContent = 'CommentContent',
  CommentOpen = 'CommentOpen',
  CommentClose = 'CommentClose',

  DoctypeOpen = 'DoctypeOpen',
  DoctypeClose = 'DoctypeClose',
  DoctypeAttributes = 'DoctypeAttributes',
  DoctypeAttributeBare = 'DoctypeAttributeBare',
  DoctypeAttributeWrapped = 'DoctypeAttributeWrapped',
}
