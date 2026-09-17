# API

## Parser

The main parser API is exposed through two functions:

### parseForESLint()

The primary entry point for ESLint integration. Returns an object with the AST, visitor keys, and other metadata.

```typescript
import type { Options, ParseForESLintResult } from 'svg-eslint-parser'

function parseForESLint(code: string, options?: Options): ParseForESLintResult
```

The result contains `ast: Program`, `visitorKeys: SourceCode.VisitorKeys`,
`services: SVGParserServices`, and `scopeManager: null`. `SourceCode` is an
ESLint type; the package's `VisitorKeys` export is the visitor-key map value.

Parsing is strict by default. Invalid SVG throws a positioned `ParseError`, so
ESLint reports it as a parsing error. Pass `{ errorRecovery: true }` to receive
the recovered AST and inspect `services.errors` instead.

Well-formedness validation covers the document root, top-level content, XML
declaration and DOCTYPE placement, XML names, comments, processing instructions,
and element attributes. Recovery mode preserves invalid constructs in the AST
where possible and reports each issue with its source range.

This is not SVG schema or DTD validation: the parser accepts XML element names
beyond SVG, and keeps entity references and DOCTYPE internal subsets as text.

**Example:**

```typescript
import { parseForESLint } from 'svg-eslint-parser'

const result = parseForESLint('<svg><circle /></svg>')
console.log(result.ast) // Program node with `document`
console.log(result.services.errors) // [] for this valid source

const recovered = parseForESLint('<svg', { errorRecovery: true })
console.log(recovered.services.errors) // Diagnostics for the incomplete source
```

In recovery mode, incomplete tags, comments, declarations, and quoted values are
preserved when possible and reported through `services.errors` with source ranges.

`services.isSVG` is always `true`. `services.errors` and `services.warnings`
contain diagnostic objects, not instances of the thrown `ParseError` class.
The diagnostic type can be obtained from the public services type:

```typescript
import type { SVGParserServices } from 'svg-eslint-parser'

type ParseDiagnostic = SVGParserServices['errors'][number]
// { type: ParseErrorType, message: string, range: Range,
//   loc: SourceLocation, recovery?: string }
```

The thrown `ParseError` extends `SyntaxError` and includes `code`, `index`,
`lineNumber`, `column`, and the original diagnostic in `cause`. Its line and
column are 1-based; diagnostic `loc` uses 1-based lines and 0-based columns.

### parse()

Simple parsing function that returns the Document node directly (without ESLint wrapping).

It uses the same strict behavior and `errorRecovery` option as `parseForESLint()`.
It returns only the document; use `parseForESLint()` to inspect diagnostics.

```typescript
function parse(code: string, options?: Options): DocumentNode
```

**Example:**

```typescript
import { parse } from 'svg-eslint-parser'

const document = parse('<svg><circle /></svg>')
console.log(document.type) // 'Document'
```

### Options

Both public parser functions accept `Options`. `errorRecovery` defaults to
`false`; set it to `true` to return a recovered AST when parsing errors occur.

The other accepted fields are `comment`, `eslintScopeManager`,
`eslintVisitorKeys`, `filePath`, `loc`, `range`, and `tokens`. They are currently
accepted for compatibility and do not change the output. Nodes always include
`loc` and `range`; `parseForESLint()` always returns tokens, comments, visitor
keys, and a `null` scope manager, even when the corresponding flags are `false`.

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
  Program,
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

  // ESLint rule-author types
  SVGNodeMap,
  SVGParserServices,
  SVGRuleContext,
  SVGRuleListener,
  SVGRuleModule,
  SVGRuleNodeMap,
  SVGSourceCode,
} from 'svg-eslint-parser'
```

Use `defineSVGRule()` to contextually type SVG listeners while returning an
ESLint-compatible rule module:

```typescript
import { defineSVGRule } from 'svg-eslint-parser'

export default defineSVGRule({
  create(context) {
    return {
      Element(node) {
        // ElementNode, including the ESLint-added parent link
        if (node.name === 'circle') {
          context.report({ node, message: 'Found a circle' })
        }
      },
    }
  },
})
```
