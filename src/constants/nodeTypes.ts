/**
 * AST node type names emitted by the parser.
 */
export enum NodeTypes {
  Attribute = 'Attribute',
  AttributeKey = 'AttributeKey',
  AttributeValue = 'AttributeValue',
  CDATA = 'CDATA',
  Comment = 'Comment',
  Doctype = 'Doctype',
  DoctypeAttribute = 'DoctypeAttribute',
  DoctypeAttributeValue = 'DoctypeAttributeValue',
  Document = 'Document',
  Element = 'Element',
  Error = 'Error',
  Program = 'Program',
  Text = 'Text',
  XMLDeclaration = 'XMLDeclaration',
  XMLDeclarationAttribute = 'XMLDeclarationAttribute',
  XMLDeclarationAttributeKey = 'XMLDeclarationAttributeKey',
  XMLDeclarationAttributeValue = 'XMLDeclarationAttributeValue',
}
