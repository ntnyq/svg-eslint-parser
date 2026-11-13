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

DOCTYPE external IDs require `SYSTEM` followed by one quoted system identifier,
or `PUBLIC` followed by a quoted public identifier and a quoted system
identifier. Internal subsets may start immediately after the root name without
whitespace. Processing-instruction targets must immediately follow `<?`; only
XML whitespace (space, tab, CR, and LF) separates targets from data or surrounds
the root element.

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
Each array is sorted by its start offset in the source. Diagnostics at the same
offset retain reporting order; across phases, tokenizer diagnostics precede
tree-construction diagnostics, then document-validation diagnostics. Strict mode
throws the first error in this ordered list, so its location may precede a later
malformed delimiter that led to recovery.

Import `ParseDiagnostic` directly to type these objects:

```typescript
import type { ParseDiagnostic } from 'svg-eslint-parser'

// ParseDiagnostic contains type, message, range, loc, and optional recovery.
```

The thrown `ParseError` extends `SyntaxError` and includes `code`, `index`,
`lineNumber`, `column`, and the original diagnostic in `cause`. Its line and
column are 1-based; diagnostic `loc` uses 1-based lines and 0-based columns.
The legacy diagnostic name `AST.ParseError` remains as a deprecated alias for
`ParseDiagnostic`; the package-level `ParseError` is the exception class.

### parse()

Simple parsing function that returns the Document node directly (without ESLint wrapping).

It uses the same strict behavior and `errorRecovery` option as `parseForESLint()`.
It returns only the document; use `parseForESLint()` to inspect diagnostics.
Both entry points share the document parsing pipeline and strict-mode policy.
`parse()` returns that document directly; only `parseForESLint()` creates the
ESLint `Program`, filters comment tokens, and collects ESLint comment metadata.

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
  ParseDiagnostic,
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

### Construction state types

Existing state-machine types, context enums, syntax constants, and the `AST`
namespace remain available from `svg-eslint-parser` for compatibility. Their
definitions now live with the modules that own them, while the package entry
lists its exports explicitly. Moving or adding an internal helper does not
automatically expose it from the package.

Supported package entry points remain `svg-eslint-parser` and
`svg-eslint-parser/package.json`; source-directory paths are implementation
details. Continue importing existing names from the package root.

The exported construction types describe parser internals. `ConstructTreeState`
now takes a `ConstructTreeContextTypes` member as its generic parameter, and the
current node is available at `state.currentContext.node`. Context frames bind
that node to their `type` and retain ancestor frames through `parentRef`; there
is no separate `currentNode` field or context `content` buffer.

For example, `ConstructTreeState<ConstructTreeContextTypes.Comment>` exposes a
`ContextualCommentNode` at `currentContext.node`. Frame references and token
indices are read-only. Construction handlers return a new state when consuming
one token or reprocessing it in another context. Nodes and diagnostics remain
mutable. This replaces the previous node-based generic and directly mutable
state fields; the public `parse()` and `parseForESLint()` entry points keep their
existing signatures.

`state.caretPosition` retains its existing name and shape for compatibility. It
is the zero-based index of the next **token**, not a source character offset.
Tokenizer source offsets and AST `range` entries count UTF-16 code units.
Existing `TokenizerContextTypes` members, including `AttributeValueWrapped`
and `AttributeValueBare`, also retain their names and string values.

### Result and query names

`parseForESLint()` returns a `ParseForESLintResult`; its `ast` field is the ESLint
`Program`, and `ast.document` is the SVG/XML `Document`. The playground uses
`parseResult`, `program`, and `parseResultJson` for these distinct values, and
names measurements `parseDurationMs` and `sourceSizeBytes` to state their units.
The public result fields keep their existing names.

The preferred plural query, [`findNodesByType()`](./utilities#findnodesbytype),
returns all matching nodes. `findNodeByType()` remains an identical compatibility
alias; `findFirstNodeByType()` returns a single match or `undefined`.
