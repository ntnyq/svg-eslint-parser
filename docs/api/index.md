# API

## Parser

The main parser API is exposed through two functions:

### parseForESLint()

The primary entry point for ESLint integration. Returns an object with the AST, visitor keys, and other metadata.

```typescript
function parseForESLint(
  code: string,
  options?: ParserOptions,
): {
  ast: Program
  visitorKeys: VisitorKeys
  services: {
    errors: ParseError[]
    isSVG: true
    warnings: ParseError[]
  }
  scopeManager: null
}
```

Parsing is strict by default. Invalid SVG throws a positioned `ParseError`, so
ESLint reports it as a parsing error. Pass `{ errorRecovery: true }` to receive
the recovered AST and inspect `services.errors` instead.

**Example:**

```typescript
import { parseForESLint } from 'svg-eslint-parser'

const result = parseForESLint('<svg><circle /></svg>')
console.log(result.ast) // Program node with `document`
console.log(result.services.errors) // Recoverable parser diagnostics
```

Incomplete tags, comments, declarations, and quoted values are preserved when
possible and reported through `services.errors` with source ranges.

### parse()

Simple parsing function that returns the Document node directly (without ESLint wrapping).

```typescript
function parse(code: string, options?: ParserOptions): DocumentNode
```

**Example:**

```typescript
import { parse } from 'svg-eslint-parser'

const document = parse('<svg><circle /></svg>')
console.log(document.type) // 'Document'
```

## AST

See [AST Structure](/api/ast) for detailed information about the AST node types.

## Utilities

See [Utilities](/api/utilities) for helper functions to work with the AST.

## Types

All TypeScript types are exported from the main entry point:

```typescript
import type {
  // Node types
  AnyNode,
  ProgramNode,
  DocumentNode,
  ElementNode,
  AttributeNode,
  TextNode,
  CommentNode,
  // ... and more

  // Utility types
  ASTVisitor,
  SourceLocation,
  Range,
} from 'svg-eslint-parser'
```
