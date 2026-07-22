# AST Structure

The SVG ESLint Parser generates an Abstract Syntax Tree (AST) that is compatible with ESLint's parser interface.

## Node Types

The parser defines **18 node types** organized into the following categories:

### Document Structure

#### Program

The root node returned by `parseForESLint()`. Wraps the Document node with ESLint-specific metadata.

```typescript
interface Program {
  type: 'Program'
  body: []
  document: DocumentNode
  range: [number, number]
  loc: SourceLocation
  tokens: AnyToken[]
  comments: ESLintComment[]
}
```

#### Document

The XML document node. Its `children` preserve prolog nodes, the root element,
comments, processing instructions, and surrounding whitespace in source order.

```typescript
interface DocumentNode {
  type: 'Document'
  children: (
    | ElementNode
    | TextNode
    | CDATANode
    | CommentNode
    | DoctypeNode
    | ProcessingInstructionNode
    | XMLDeclarationNode
  )[]
  range: [number, number]
  loc: SourceLocation
}
```

### Elements

#### Element

Represents an SVG element (e.g., `<svg>`, `<circle>`, `<path>`).

```typescript
interface ElementNode {
  type: 'Element'
  name: string // Source spelling is preserved; XML names are case-sensitive
  attributes: AttributeNode[]
  children: (
    ElementNode | TextNode | CDATANode | CommentNode | ProcessingInstructionNode
  )[]
  selfClosing: boolean
  range: [number, number]
  loc: SourceLocation
}
```

### Attributes

#### Attribute

Represents an attribute of an SVG element.

```typescript
interface AttributeNode {
  type: 'Attribute'
  key: AttributeKeyNode
  value?: AttributeValueNode
  quoteChar?: '"' | "'"
  range: [number, number]
  loc: SourceLocation
}
```

#### AttributeKey

The attribute name.

```typescript
interface AttributeKeyNode {
  type: 'AttributeKey'
  value: string // e.g., 'width', 'fill'
  range: [number, number]
  loc: SourceLocation
}
```

#### AttributeValue

The attribute value without its wrapper quotes. The wrapper is recorded on the
parent `AttributeNode.quoteChar`.

```typescript
interface AttributeValueNode {
  type: 'AttributeValue'
  value: string // e.g., '100', 'red'
  range: [number, number]
  loc: SourceLocation
}
```

### Text & Comments

#### Text

Text content between tags.

```typescript
interface TextNode {
  type: 'Text'
  value: string
  range: [number, number]
  loc: SourceLocation
}
```

#### CDATA

Raw character data inside a `<![CDATA[...]]>` section. Markup-looking content
is kept in `value` and is not parsed as child elements.

```typescript
interface CDATANode {
  type: 'CDATA'
  value: string
  range: [number, number]
  loc: SourceLocation
}
```

#### Comment

SVG/XML comment (e.g., `<!-- comment -->`).

```typescript
interface CommentNode {
  type: 'Comment'
  content: string
  value: string // alias for content
  range: [number, number]
  loc: SourceLocation
}
```

### XML Declaration

#### ProcessingInstruction

A generic XML processing instruction such as `<?xml-stylesheet ...?>`.

```typescript
interface ProcessingInstructionNode {
  type: 'ProcessingInstruction'
  target: string
  value: string
  range: [number, number]
  loc: SourceLocation
}
```

#### XMLDeclaration

XML declaration (e.g., `<?xml version="1.0" encoding="UTF-8"?>`).

```typescript
interface XMLDeclarationNode {
  type: 'XMLDeclaration'
  attributes: XMLDeclarationAttributeNode[]
  range: [number, number]
  loc: SourceLocation
}
```

#### XMLDeclarationAttribute

An attribute in the XML declaration.

```typescript
interface XMLDeclarationAttributeNode {
  type: 'XMLDeclarationAttribute'
  key: XMLDeclarationAttributeKeyNode
  value?: XMLDeclarationAttributeValueNode
  quoteChar?: '"' | "'"
  range: [number, number]
  loc: SourceLocation
}
```

#### XMLDeclarationAttributeKey

Attribute name in XML declaration.

```typescript
interface XMLDeclarationAttributeKeyNode {
  type: 'XMLDeclarationAttributeKey'
  value: string // e.g., 'version', 'encoding'
  range: [number, number]
  loc: SourceLocation
}
```

#### XMLDeclarationAttributeValue

Attribute value in XML declaration.

```typescript
interface XMLDeclarationAttributeValueNode {
  type: 'XMLDeclarationAttributeValue'
  value: string
  range: [number, number]
  loc: SourceLocation
}
```

### DOCTYPE

#### Doctype

DOCTYPE declaration (e.g., `<!DOCTYPE svg PUBLIC ...>`). When present,
`internalSubset` contains the text between `[` and `]` without the delimiters.

```typescript
interface DoctypeNode {
  type: 'Doctype'
  attributes: DoctypeAttributeNode[]
  internalSubset?: string
  range: [number, number]
  loc: SourceLocation
}
```

#### DoctypeAttribute

An attribute in the DOCTYPE declaration.

```typescript
interface DoctypeAttributeNode {
  type: 'DoctypeAttribute'
  value?: DoctypeAttributeValueNode
  quoteChar?: '"' | "'"
  range: [number, number]
  loc: SourceLocation
}
```

#### DoctypeAttributeValue

Value in DOCTYPE declaration.

```typescript
interface DoctypeAttributeValueNode {
  type: 'DoctypeAttributeValue'
  value: string
  range: [number, number]
  loc: SourceLocation
}
```

### Error Handling

#### Error

Represents a parse error node.

```typescript
interface ErrorNode {
  type: 'Error'
  code: string
  message: string
  recoveredNode?: AnyNode
  range: [number, number]
  loc: SourceLocation
}
```

## Common Properties

All nodes share these common properties:

### range

Tuple of start and end-exclusive character offsets in the source code (0-based).

```typescript
range: [number, number]
```

### loc

Source location information with 1-based lines and 0-based columns.

```typescript
interface SourceLocation {
  start: Position
  end: Position
}

interface Position {
  line: number // 1-based
  column: number // 0-based
}
```

## Example AST

For the SVG:

```xml
<svg width="100" height="100">
  <circle />
</svg>
```

The abbreviated shape is:

```jsonc
{
  "type": "Program",
  "body": [],
  "document": {
    "type": "Document",
    "children": [
      {
        "type": "Element",
        "name": "svg",
        "selfClosing": false,
        "attributes": [
          {
            "type": "Attribute",
            "key": { "type": "AttributeKey", "value": "width" },
            "value": { "type": "AttributeValue", "value": "100" },
            "quoteChar": "\"",
          },
          // height attribute omitted
        ],
        "children": [
          { "type": "Text", "value": "\n  " },
          {
            "type": "Element",
            "name": "circle",
            "selfClosing": true,
            "attributes": [],
            "children": [],
          },
          { "type": "Text", "value": "\n" },
        ],
      },
    ],
  },
}
```

Every node also includes `range` and `loc`; the `Program` additionally includes
ESLint `tokens` and `comments` arrays.

## Traversing the AST

See the [Utilities documentation](/api/utilities) for helper functions to traverse and manipulate the AST.
