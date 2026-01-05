# SVG ESLint Parser - AI Coding Agent Instructions

## Project Overview

**svg-eslint-parser** is an ESLint-compatible parser for SVG files. It transforms SVG source code into an AST (Abstract Syntax Tree) compatible with ESLint's parser interface, enabling eslint rules to operate on SVG content.

Status: Work in progress (v0.0.4), not production-ready.

## Architecture & Data Flow

The parser follows a **three-stage pipeline**:

```
SVG Source → Tokenizer → Constructor → AST
```

### Stage 1: Tokenizer (`src/tokenizer/`)

- **Purpose**: Breaks SVG source into tokens
- **Key files**: `tokenize.ts` (entry point), handlers for specific contexts
- **Handlers**: Process different token types (attributes, tags, comments, DOCTYPE, XML declarations)
- **Output**: Array of `AnyToken` (typed tokens with location/range info)
- **Pattern**: Each handler in `handlers/` manages a tokenization context (e.g., `attributeKey.ts`, `openTagStart.ts`)

### Stage 2: Constructor (`src/constructor/`)

- **Purpose**: Builds AST from tokens using a state machine
- **Key file**: `constructTree.ts` orchestrates context handlers
- **Context handlers**: Map `ConstructTreeContextTypes` → handler functions via `contextHandlers` object
- **Key types**: `ConstructTreeState`, `AnyToken`, `DocumentNode`
- **Pattern**: Handlers consume tokens and emit AST nodes; context changes drive state machine

### Stage 3: Parser (`src/parser/`)

- **Parse flow** (`parse.ts`): Tokenize → constructTree → clearParent (removes parent refs)
- **ESLint interface** (`parseForESLint.ts`): Wraps AST in Program node, filters comment tokens, provides `visitorKeys`
- **Visitor keys** (`visitorKeys.ts`): Defines traversal order for each node type (merged with ESLint's own keys)

## Key Types & Node Structure

### Core Node Types

- **Document**: Root node containing children (tags, comments, text)
- **Program**: ESLint wrapper around Document with tokens and comments arrays
- **Tag**: Element with attributes, children, open/close tag nodes
- **Attribute**: Key-value pair with wrapper nodes for quotes
- **Text, Comment, XMLDeclaration, Doctype**: Special node types

See `src/types/ast/` for full definitions.

### Token vs. Node Distinction

- **Tokens** (`TokenTypes` enum): Low-level lexical units with exact source positions
- **Nodes** (`NodeTypes` enum): Higher-level AST representing structure and semantics
- Example: `<svg>` becomes OpenTagStart + TagName tokens → combined into Tag node

## Developer Workflows

### Build & Development

- **Build**: `pnpm run build` (uses `tsdown` transpiler)
- **Watch mode**: `pnpm run dev`
- **Type check**: `pnpm run typecheck`
- **Lint**: `pnpm run lint` (eslint on source)

### Testing

- **Run tests**: `pnpm run test` (vitest)
- **Tests location**: `tests/parse/` (base.test.ts, doctype.test.ts, xml.test.ts)
- **Snapshot testing**: Uses vitest snapshots in `__snapshots__/`
- **Test pattern**: Use `unindent` utility (`@ntnyq/utils`) for readable multi-line SVG test inputs

### Documentation

- **Playground**: https://svg-eslint-parser.ntnyq.com/play
- **Docs**: `pnpm run docs:dev` (VitePress in `docs/`)
- **API docs**: `docs/api/` references AST structure

### Release

- **Release check**: `pnpm run release:check` (lint → typecheck → test)
- **Version bump**: Uses `bumpp` package
- **Publishing**: Prepublish hook runs build

## Project-Specific Patterns

### Handler Pattern

Both tokenizer and constructor use **handler functions** indexed by context type:

```typescript
const contextHandlers: Record<ContextType, Handler> = {
  [ContextType.TagName]: tagNameHandler,
  // ...
}
```

When context changes, handlers are looked up and invoked with current state/token.

### Utility Functions

- `src/utils/`: Helpers for location tracking (`calculateTokenLocation`, `calculateTokenPosition`), AST manipulation (`createNodeFrom`, `clearParent`)
- `@ntnyq/utils` package: Used for string utilities (`unindent` in tests)

### Constants Organization

- `src/constants/`: Enums (NodeTypes, TokenTypes), parsing rules (parse.ts), special characters, SVG elements, context types
- Single source of truth for all token/node type definitions

### ESLint Integration Points

- **VisitorKeys**: Defines which node properties are traversable (in `visitorKeys.ts`)
- **ParseForESLint**: Returns object with `ast`, `visitorKeys`, `services`, `scopeManager`
- **Services object**: `{ isSVG: true }` marks output as SVG-specific

## Testing & Debugging

- Tests are **snapshot-based** for AST validation; run `pnpm run test` to verify
- Use `parseForESLint(source).ast` to inspect AST structure during development
- Common test source: SVG from ESLint logo (see base.test.ts)
- For tokenizer debugging: Check `tokenize()` output directly
- For constructor debugging: Use `constructTree(tokens)` and inspect node tree

## Dependencies & Integration

**Minimal dependencies**:

- `@ntnyq/utils`: String utilities (unindent, etc.)
- `eslint-visitor-keys`: Merges custom visitorKeys with ESLint defaults
- Dev: `tsdown` (TypeScript bundler), `vitest` (test runner), `typescript 5.9+`

**No external SVG parsing**: Implements from scratch using state machine (not using DOM/XML libraries).
