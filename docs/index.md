---
layout: home

hero:
  name: svg-eslint-parser
  tagline: An SVG parser that produces output compatible with ESLint
  image:
    light: /logo.svg
    dark: /logo.svg
  actions:
    - theme: brand
      text: Get Started
      link: /guide/
    - theme: alt
      text: Playground
      link: /play/
    - theme: alt
      text: API Reference
      link: /api/

features:
  - icon: ✅
    title: ESLint Compatible
    details: Produces AST compatible with ESLint's parser interface for seamless integration with ESLint rules and plugins.
  - icon: 🎯
    title: Type Safe
    details: Full TypeScript support with comprehensive type definitions for all AST nodes and utility functions.
  - icon: 🔍
    title: Rich Utilities
    details: Built-in functions for searching, traversing, validating, and manipulating AST nodes with ease.
  - icon: 📊
    title: Detailed AST
    details: 18 node types covering all SVG/XML constructs including tags, attributes, comments, DOCTYPE, and XML declarations.
  - icon: 🚀
    title: Zero Dependencies
    details: Minimal runtime dependencies for fast installation and optimal bundle size.
  - icon: 🎪
    title: Interactive Playground
    details: Try the parser online with live AST visualization and instant feedback.
---

<div id="package_status">

[![CI](https://github.com/ntnyq/svg-eslint-parser/workflows/CI/badge.svg)](https://github.com/ntnyq/svg-eslint-parser/actions)
[![NPM VERSION](https://img.shields.io/npm/v/svg-eslint-parser.svg)](https://www.npmjs.com/package/svg-eslint-parser)
[![NPM DOWNLOADS](https://img.shields.io/npm/dy/svg-eslint-parser.svg)](https://www.npmjs.com/package/svg-eslint-parser)
[![CODECOV](https://codecov.io/github/ntnyq/svg-eslint-parser/branch/main/graph/badge.svg?token=ECHQ09F90X)](https://codecov.io/github/ntnyq/svg-eslint-parser)
[![LICENSE](https://img.shields.io/github/license/ntnyq/svg-eslint-parser.svg)](https://github.com/ntnyq/svg-eslint-parser/blob/main/LICENSE)

</div>

## Quick Start

```bash
npm install svg-eslint-parser -D
```

```typescript
import { parseForESLint, findNodeByType, NodeTypes } from 'svg-eslint-parser'

const { ast } = parseForESLint('<svg><circle cx="50" /></svg>')
const tags = findNodeByType(ast.body[0], NodeTypes.Tag)
console.log(`Found ${tags.length} tags`)
```

## Resources

- **[Guide](./guide/)** - Get started with the parser
- **[API Reference](./api/)** - Complete API documentation
- **[AST Structure](./api/ast)** - Learn about the AST node types
- **[Utilities](./api/utilities)** - Explore helper functions
- **[Migration Guide](./guide/migration)** - Upgrade from previous versions
- **[Playground](./play/)** - Try it online with live visualization
