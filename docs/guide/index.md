# Guide

## Install

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
console.log(result.ast.body[0].type) // 'Document'
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
const document = ast.body[0]

// Find all tag nodes
const tags = findNodeByType(document, NodeTypes.Tag)
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
