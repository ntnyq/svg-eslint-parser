# svg-eslint-parser

[![CI](https://github.com/ntnyq/svg-eslint-parser/workflows/CI/badge.svg)](https://github.com/ntnyq/svg-eslint-parser/actions)
[![NPM VERSION](https://img.shields.io/npm/v/svg-eslint-parser.svg)](https://www.npmjs.com/package/svg-eslint-parser)
[![NPM DOWNLOADS](https://img.shields.io/npm/dy/svg-eslint-parser.svg)](https://www.npmjs.com/package/svg-eslint-parser)
[![LICENSE](https://img.shields.io/github/license/ntnyq/svg-eslint-parser.svg)](https://github.com/ntnyq/svg-eslint-parser/blob/main/LICENSE)

> :package: An SVG parser that produces output compatible with ESLint.

> [!IMPORTANT]
> Status: Work In Progress, not ready for production.
>
> API is not stable now, use at your own risk.

## Features

- ✅ **ESLint Compatible**: Produces AST compatible with ESLint's parser interface
- 🎯 **Type Safe**: Full TypeScript support with comprehensive type definitions
- 🔍 **Rich Utilities**: Built-in functions for searching, traversing, and manipulating AST
- 📊 **Detailed AST**: 18 node types covering all SVG/XML constructs
- 🚀 **Zero Dependencies**: Minimal runtime dependencies for fast installation
- 🎪 **Interactive Playground**: Try it online at [svg-eslint-parser.ntnyq.com](https://svg-eslint-parser.ntnyq.com/play)

## Install

```shell
npm install svg-eslint-parser -D
```

```shell
yarn add svg-eslint-parser -D
```

```shell
pnpm add svg-eslint-parser -D
```

## Usage

### Basic Parsing

```typescript
import { parse, parseForESLint } from 'svg-eslint-parser'

// For direct use
const document = parse('<svg><circle cx="50" cy="50" r="40" /></svg>')
console.log(document.type) // 'Document'

// For ESLint integration
const result = parseForESLint('<svg><circle cx="50" cy="50" r="40" /></svg>')
console.log(result.ast.type) // 'Program'
```

### With ESLint

```javascript
import pluginSVG from 'eslint-plugin-svg'
import * as parserSVG from 'svg-eslint-parser'

export default [
  {
    name: 'svg/rules',
    files: ['**/*.svg'],
    plugins: {
      svg: pluginSVG,
    },
    languageOptions: {
      parser: parserSVG,
    },
    rules: {
      'svg/no-empty-title': 'error',
    },
  },
]
```

### Using Utilities

```typescript
import {
  parseForESLint,
  findNodeByType,
  NodeTypes,
  traverseAST,
} from 'svg-eslint-parser'

const { ast } = parseForESLint(svgSource)
const document = ast.body[0]

// Find all tag nodes
const tags = findNodeByType(document, NodeTypes.Tag)
console.log(`Found ${tags.length} tags`)

// Traverse with visitor pattern
traverseAST(document, {
  enter(node, parent) {
    console.log('Visiting:', node.type)
    // Return false to skip children
    if (node.type === 'Comment') return false
  },
  leave(node, parent) {
    console.log('Leaving:', node.type)
  },
})
```

## API

### Parser Functions

#### `parseForESLint(code: string, options?: ParserOptions)`

Returns an ESLint-compatible result with AST, visitor keys, and services.

#### `parse(code: string, options?: ParserOptions)`

Returns a Document node directly.

### Utility Functions

#### Search & Traversal

- `findNodeByType<T>(node, type)` - Find all nodes of a specific type
- `findFirstNodeByType<T>(node, type)` - Find first node of a specific type
- `traverseAST(node, visitor)` - Visitor pattern traversal with enter/leave hooks
- `walkAST(node, callback)` - Simple traversal with callback

#### Validation

- `validateNode(node)` - Validate node structure
- `isNodeType<T>(node, type)` - Type guard function

#### Manipulation

- `cloneNode<T>(node)` - Deep clone without parent references
- `cloneNodeWithParent<T>(node, parent?)` - Clone preserving parent refs
- `filterNodes(node, predicate)` - Filter nodes by predicate
- `mapNodes<T>(node, mapper)` - Map over all nodes

#### Analysis

- `countNodes(node)` - Count total nodes
- `getNodeDepth(node)` - Get node depth (requires parent refs)
- `getParentChain(node)` - Get ancestor chain (requires parent refs)

### Node Types

The parser defines 34 node types:

**Document Structure**: `Program`, `Document`

**Elements**: `Tag`, `OpenTagStart`, `OpenTagEnd`, `CloseTag`

**Attributes**: `Attribute`, `AttributeKey`, `AttributeValue`, `AttributeValueWrapperStart`, `AttributeValueWrapperEnd`

**Text & Comments**: `Text`, `Comment`, `CommentOpen`, `CommentContent`, `CommentClose`

**XML Declaration**: `XMLDeclaration`, `XMLDeclarationOpen`, `XMLDeclarationClose`, `XMLDeclarationAttribute`, `XMLDeclarationAttributeKey`, `XMLDeclarationAttributeValue`, `XMLDeclarationAttributeValueWrapperStart`, `XMLDeclarationAttributeValueWrapperEnd`

**DOCTYPE**: `Doctype`, `DoctypeOpen`, `DoctypeClose`, `DoctypeAttribute`, `DoctypeAttributeValue`, `DoctypeAttributeWrapperStart`, `DoctypeAttributeWrapperEnd`

**Error Handling**: `Error`

## Documentation

Full documentation is available at [svg-eslint-parser.ntnyq.com](https://svg-eslint-parser.ntnyq.com):

- [API Documentation](https://svg-eslint-parser.ntnyq.com/api/)
- [AST Structure](https://svg-eslint-parser.ntnyq.com/api/ast)
- [Utilities Guide](https://svg-eslint-parser.ntnyq.com/api/utilities)
- [Migration Guide](https://svg-eslint-parser.ntnyq.com/guide/migration)

## Playground

You can try the parser in the [interactive playground](https://svg-eslint-parser.ntnyq.com/play).

Feel free to open an issue if you have any suggestions or find any bugs.

## Example: Finding All Circles

```typescript
import { parseForESLint, findNodeByType, NodeTypes } from 'svg-eslint-parser'

const svgCode = `
<svg width="200" height="200">
  <circle cx="50" cy="50" r="40" fill="red" />
  <circle cx="150" cy="150" r="30" fill="blue" />
  <rect x="10" y="10" width="50" height="50" />
</svg>
`

const { ast } = parseForESLint(svgCode)
const document = ast.body[0]

// Find all tags and filter for circles
const allTags = findNodeByType(document, NodeTypes.Tag)
const circles = allTags.filter(tag => tag.name === 'circle')

console.log(`Found ${circles.length} circles`)

circles.forEach((circle, i) => {
  const cx = circle.attributes.find(attr => attr.key.value === 'cx')
  const cy = circle.attributes.find(attr => attr.key.value === 'cy')
  const r = circle.attributes.find(attr => attr.key.value === 'r')

  console.log(
    `Circle ${i + 1}: cx=${cx?.value?.value}, cy=${cy?.value?.value}, r=${r?.value?.value}`,
  )
})
```

Output:

```
Found 2 circles
Circle 1: cx=50, cy=50, r=40
Circle 2: cx=150, cy=150, r=30
```

## Links

- [Scalable Vector Graphics (SVG) 2](https://www.w3.org/TR/SVG2/)

## Credits

- Based on [yeonjuan/es-html-parser](https://github.com/yeonjuan/es-html-parser).

## License

[MIT](./LICENSE) License © 2024-PRESENT [ntnyq](https://github.com/ntnyq)
