# AST Structure

The SVG ESLint Parser generates an Abstract Syntax Tree (AST) that is compatible with ESLint's parser interface.

## Node Types

The parser defines **34 node types** organized into the following categories:

### Document Structure

#### Program

The root node returned by `parseForESLint()`. Wraps the Document node with ESLint-specific metadata.

```typescript
interface ProgramNode {
  type: 'Program'
  body: DocumentNode[]
  sourceType: 'module'
  range: [number, number]
  loc: SourceLocation
  tokens: Token[]
  comments: CommentNode[]
}
```

#### Document

The root node of the SVG document. Contains all top-level elements, text, and comments.

```typescript
interface DocumentNode {
  type: 'Document'
  children: (
    | TagNode
    | TextNode
    | CommentNode
    | DoctypeNode
    | XMLDeclarationNode
  )[]
  range: [number, number]
  loc: SourceLocation
}
```

### Elements

#### Tag

Represents an SVG element (e.g., `<svg>`, `<circle>`, `<path>`).

```typescript
interface TagNode {
  type: 'Tag'
  name: string
  attributes: AttributeNode[]
  children: (TagNode | TextNode | CommentNode)[]
  openTag: {
    start: OpenTagStartNode
    end: OpenTagEndNode
  }
  closeTag: CloseTagNode | null
  selfClosing: boolean
  range: [number, number]
  loc: SourceLocation
}
```

#### OpenTagStart

Opening bracket and tag name (e.g., `<svg`).

```typescript
interface OpenTagStartNode {
  type: 'OpenTagStart'
  value: string // e.g., '<svg'
  range: [number, number]
  loc: SourceLocation
}
```

#### OpenTagEnd

Closing bracket of opening tag (e.g., `>` or `/>`).

```typescript
interface OpenTagEndNode {
  type: 'OpenTagEnd'
  value: string // '>' or '/>'
  range: [number, number]
  loc: SourceLocation
}
```

#### CloseTag

Closing tag (e.g., `</svg>`).

```typescript
interface CloseTagNode {
  type: 'CloseTag'
  value: string // e.g., '</svg>'
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
  value: AttributeValueNode | null
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

The attribute value with its wrapper quotes.

```typescript
interface AttributeValueNode {
  type: 'AttributeValue'
  value: string // e.g., '100', 'red'
  wrapperStart: AttributeValueWrapperStartNode
  wrapperEnd: AttributeValueWrapperEndNode
  range: [number, number]
  loc: SourceLocation
}
```

#### AttributeValueWrapperStart

Opening quote of attribute value.

```typescript
interface AttributeValueWrapperStartNode {
  type: 'AttributeValueWrapperStart'
  value: '"' | "'"
  range: [number, number]
  loc: SourceLocation
}
```

#### AttributeValueWrapperEnd

Closing quote of attribute value.

```typescript
interface AttributeValueWrapperEndNode {
  type: 'AttributeValueWrapperEnd'
  value: '"' | "'"
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

#### Comment

SVG/XML comment (e.g., `<!-- comment -->`).

```typescript
interface CommentNode {
  type: 'Comment'
  open: CommentOpenNode
  content: CommentContentNode
  close: CommentCloseNode
  value: string // content without delimiters
  range: [number, number]
  loc: SourceLocation
}
```

#### CommentOpen

Opening delimiter (`<!--`).

```typescript
interface CommentOpenNode {
  type: 'CommentOpen'
  value: '<!--'
  range: [number, number]
  loc: SourceLocation
}
```

#### CommentContent

The actual comment text.

```typescript
interface CommentContentNode {
  type: 'CommentContent'
  value: string
  range: [number, number]
  loc: SourceLocation
}
```

#### CommentClose

Closing delimiter (`-->`).

```typescript
interface CommentCloseNode {
  type: 'CommentClose'
  value: '-->'
  range: [number, number]
  loc: SourceLocation
}
```

### XML Declaration

#### XMLDeclaration

XML declaration (e.g., `<?xml version="1.0" encoding="UTF-8"?>`).

```typescript
interface XMLDeclarationNode {
  type: 'XMLDeclaration'
  open: XMLDeclarationOpenNode
  attributes: XMLDeclarationAttributeNode[]
  close: XMLDeclarationCloseNode
  range: [number, number]
  loc: SourceLocation
}
```

#### XMLDeclarationOpen

Opening delimiter (`<?xml`).

```typescript
interface XMLDeclarationOpenNode {
  type: 'XMLDeclarationOpen'
  value: '<?xml'
  range: [number, number]
  loc: SourceLocation
}
```

#### XMLDeclarationClose

Closing delimiter (`?>`).

```typescript
interface XMLDeclarationCloseNode {
  type: 'XMLDeclarationClose'
  value: '?>'
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
  value: XMLDeclarationAttributeValueNode
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

Attribute value in XML declaration with wrapper quotes.

```typescript
interface XMLDeclarationAttributeValueNode {
  type: 'XMLDeclarationAttributeValue'
  value: string
  wrapperStart: XMLDeclarationAttributeValueWrapperStartNode
  wrapperEnd: XMLDeclarationAttributeValueWrapperEndNode
  range: [number, number]
  loc: SourceLocation
}
```

### DOCTYPE

#### Doctype

DOCTYPE declaration (e.g., `<!DOCTYPE svg PUBLIC ...>`).

```typescript
interface DoctypeNode {
  type: 'Doctype'
  open: DoctypeOpenNode
  attributes: DoctypeAttributeNode[]
  close: DoctypeCloseNode
  range: [number, number]
  loc: SourceLocation
}
```

#### DoctypeOpen

Opening delimiter (`<!DOCTYPE`).

```typescript
interface DoctypeOpenNode {
  type: 'DoctypeOpen'
  value: '<!DOCTYPE'
  range: [number, number]
  loc: SourceLocation
}
```

#### DoctypeClose

Closing delimiter (`>`).

```typescript
interface DoctypeCloseNode {
  type: 'DoctypeClose'
  value: '>'
  range: [number, number]
  loc: SourceLocation
}
```

#### DoctypeAttribute

An attribute in the DOCTYPE declaration.

```typescript
interface DoctypeAttributeNode {
  type: 'DoctypeAttribute'
  value: DoctypeAttributeValueNode
  range: [number, number]
  loc: SourceLocation
}
```

#### DoctypeAttributeValue

Value in DOCTYPE declaration with optional wrapper quotes.

```typescript
interface DoctypeAttributeValueNode {
  type: 'DoctypeAttributeValue'
  value: string
  wrapperStart: DoctypeAttributeWrapperStartNode | null
  wrapperEnd: DoctypeAttributeWrapperEndNode | null
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
  message: string
  range: [number, number]
  loc: SourceLocation
}
```

## Common Properties

All nodes share these common properties:

### range

Tuple of start and end character positions in the source code (0-based).

```typescript
range: [number, number]
```

### loc

Source location information with line and column numbers (1-based).

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
  <circle cx="50" cy="50" r="40" />
</svg>
```

The parser generates:

```json
{
  "type": "Program",
  "body": [
    {
      "type": "Document",
      "children": [
        {
          "type": "Tag",
          "name": "svg",
          "attributes": [
            {
              "type": "Attribute",
              "key": {
                "type": "AttributeKey",
                "value": "width"
              },
              "value": {
                "type": "AttributeValue",
                "value": "100",
                "wrapperStart": {
                  "type": "AttributeValueWrapperStart",
                  "value": "\""
                },
                "wrapperEnd": {
                  "type": "AttributeValueWrapperEnd",
                  "value": "\""
                }
              }
            }
            // ... more attributes
          ],
          "children": [
            {
              "type": "Text",
              "value": "\n  "
            },
            {
              "type": "Tag",
              "name": "circle",
              "selfClosing": true,
              "attributes": [
                /* ... */
              ],
              "children": []
            }
            // ... more children
          ]
        }
      ]
    }
  ]
}
```

## Traversing the AST

See the [Utilities documentation](/api/utilities) for helper functions to traverse and manipulate the AST.
