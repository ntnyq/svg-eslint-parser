# Guide

## Install

Requires Node.js `^22.13.0 || >=24` and ESLint 9 or newer.

::: code-group

```shell [npm]
npm i svg-eslint-parser -D
```

```shell [yarn]
yarn add svg-eslint-parser -D
```

```shell [pnpm]
pnpm add svg-eslint-parser -D
```

:::

## Usage

### ESLint

Install `eslint-plugin-svg` as a dev dependency to use the rules in this example.

```ts [eslint.config.mjs] twoslash
// @noErrors
import pluginSVG from 'eslint-plugin-svg'
import * as parserSVG from 'svg-eslint-parser'

/**
 * @type {import('eslint').Linter.Config[]}
 */
export default [
  // other configs
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
      // enable rules of eslint-plugin-svg
      'svg/no-empty-title': 'error',
    },
  },
]
```

### Programmatic Usage

```typescript
import { parse, parseForESLint } from 'svg-eslint-parser'

// Simple parsing - returns Document node
const document = parse('<svg><circle /></svg>')
console.log(document.type) // 'Document'

// ESLint-compatible parsing - returns Program with metadata
const result = parseForESLint('<svg><circle /></svg>')
console.log(result.ast.type) // 'Program'
console.log(result.ast.document.type) // 'Document'
```

### Using Utilities

```typescript
import {
  parseForESLint,
  findNodeByType,
  NodeTypes,
  traverseAST,
} from 'svg-eslint-parser'

const svgSource = '<svg><circle cx="50" /></svg>'
const { ast } = parseForESLint(svgSource)
const document = ast.document

// Find all tag nodes
const tags = findNodeByType(document, NodeTypes.Element)
console.log(`Found ${tags.length} tags`)

// Traverse the AST
traverseAST(document, {
  enter(node) {
    console.log('Entering:', node.type)
  },
  leave(node) {
    console.log('Leaving:', node.type)
  },
})
```

## Migration

See the [Migration Guide](/guide/migration) for upgrading from previous versions.

## Further Reading

- [API Documentation](/api/)
- [AST Structure](/api/ast)
- [Utilities](/api/utilities)

## Source organization

The implementation groups definitions and tools with the phase that owns them:

| Directory          | Responsibility                                                                     |
| ------------------ | ---------------------------------------------------------------------------------- |
| `src/tokenizer/`   | Character scanning, tokens, tokenizer contexts and state, token positions          |
| `src/treeBuilder/` | AST construction, context frames and state, node-building tools                    |
| `src/ast/`         | AST definitions, visitor keys, traversal, search, cloning, transformation          |
| `src/parser/`      | Parsing orchestration, document validation, error policy, ESLint output adaptation |
| `src/diagnostics/` | Diagnostics, collection, source-order sorting, parse exceptions                    |
| `src/eslint/`      | Typed rule definitions and ESLint-facing types                                     |
| `src/source/`      | Shared source locations and line indexing                                          |
| `src/syntax/`      | Shared XML syntax markers, name patterns, and syntax readers                       |

`src/index.ts` explicitly lists the public API. Existing implementation exports
are retained through `src/compat.ts`, and `src/types/index.ts` preserves the
existing `AST` type namespace. New implementation code imports from the owning
module, keeping compatibility facades separate from internal dependencies.

Consumers continue using the same package-root imports; these directories do
not introduce additional package entry points.
