# Migration Guide

## Overview

This guide helps you migrate to the latest version of svg-eslint-parser with improved AST structure and new utility functions.

## What's Changed

### Enhanced AST Structure (v0.0.4+)

The AST structure has been refined for better consistency and ease of use:

- **Consistent Node Types**: All nodes now follow a consistent structure with `type`, `range`, and `loc` properties
- **Better Type Safety**: Enhanced TypeScript types for all node types
- **Parent References**: Added support for parent references through utility functions

### New Utility Functions (v0.0.5+)

Added comprehensive utility functions for AST manipulation:

- **Search**: `findNodeByType()`, `findFirstNodeByType()`
- **Traversal**: `traverseAST()`, `walkAST()`
- **Validation**: `validateNode()`, `isNodeType()`
- **Manipulation**: `cloneNode()`, `cloneNodeWithParent()`, `filterNodes()`, `mapNodes()`
- **Analysis**: `countNodes()`, `getNodeDepth()`, `getParentChain()`

## Migration Steps

### 1. Update Your Package

```bash
npm install svg-eslint-parser@latest
# or
pnpm add svg-eslint-parser@latest
# or
yarn add svg-eslint-parser@latest
```

### 2. Update Imports

If you were using internal utilities, update to use the new public API:

**Before:**

```typescript
// Internal imports (not recommended)
import { tokenize } from 'svg-eslint-parser/dist/tokenizer'
```

**After:**

```typescript
// Use public API utilities
import { parseForESLint, findNodeByType, NodeTypes } from 'svg-eslint-parser'
```

### 3. Update AST Traversal

If you were manually traversing the AST, consider using the new utility functions:

**Before:**

```typescript
function findTags(node: any): any[] {
  const tags: any[] = []

  if (node.type === 'Tag') {
    tags.push(node)
  }

  if (node.children) {
    for (const child of node.children) {
      tags.push(...findTags(child))
    }
  }

  if (node.attributes) {
    for (const attr of node.attributes) {
      tags.push(...findTags(attr))
    }
  }

  return tags
}
```

**After:**

```typescript
import { findNodeByType, NodeTypes } from 'svg-eslint-parser'

const tags = findNodeByType(document, NodeTypes.Tag)
```

### 4. Update Node Type Checks

Use the new type guard function for better type safety:

**Before:**

```typescript
if (node.type === 'Tag') {
  // TypeScript doesn't know node is TagNode
  const name = (node as any).name
}
```

**After:**

```typescript
import { isNodeType, NodeTypes } from 'svg-eslint-parser'

if (isNodeType(node, NodeTypes.Tag)) {
  // TypeScript knows node is TagNode
  const name = node.name
}
```

### 5. Update Node Validation

Use the built-in validation function:

**Before:**

```typescript
function isValidNode(node: any): boolean {
  return (
    node
    && typeof node.type === 'string'
    && Array.isArray(node.range)
    && node.range.length === 2
  )
}
```

**After:**

```typescript
import { validateNode } from 'svg-eslint-parser'

const isValid = validateNode(node)
```

### 6. Update AST Cloning

Use the new cloning utilities for safer node manipulation:

**Before:**

```typescript
const cloned = JSON.parse(JSON.stringify(node))
```

**After:**

```typescript
import { cloneNode } from 'svg-eslint-parser'

const cloned = cloneNode(node)
// Parent references are automatically removed
```

### 7. Update Visitor Pattern

If you implemented custom visitors, use the new `traverseAST()`:

**Before:**

```typescript
function visit(node: any, callback: (node: any) => void) {
  callback(node)
  if (node.children) {
    node.children.forEach((child: any) => visit(child, callback))
  }
}

visit(ast, node => {
  console.log(node.type)
})
```

**After:**

```typescript
import { traverseAST } from 'svg-eslint-parser'

traverseAST(ast.body[0], {
  enter(node) {
    console.log(node.type)
  },
})
```

## Breaking Changes

### None Yet

As of v0.0.5, there are no breaking changes to the public API. All previous functionality remains intact, and new utilities are additions to the API.

## New Features

### 1. Search Utilities

Easily find nodes by type:

```typescript
import { parseForESLint, findNodeByType, NodeTypes } from 'svg-eslint-parser'

const { ast } = parseForESLint(svgSource)
const circles = findNodeByType(ast.body[0], NodeTypes.Tag).filter(
  tag => tag.name === 'circle',
)
```

### 2. Visitor Pattern

Implement complex traversals with enter/leave hooks:

```typescript
import { traverseAST } from 'svg-eslint-parser'

let depth = 0
traverseAST(ast.body[0], {
  enter(node) {
    console.log('  '.repeat(depth) + node.type)
    depth++
  },
  leave(node) {
    depth--
  },
})
```

### 3. Node Validation

Validate node structures at runtime:

```typescript
import { validateNode } from 'svg-eslint-parser'

if (!validateNode(node)) {
  throw new Error('Invalid AST node')
}
```

### 4. Type Guards

Use type guards for better TypeScript support:

```typescript
import { isNodeType, NodeTypes } from 'svg-eslint-parser'

nodes.forEach(node => {
  if (isNodeType(node, NodeTypes.Tag)) {
    // TypeScript knows node.name exists
    console.log(node.name)
  }
})
```

### 5. AST Analysis

Analyze your AST structure:

```typescript
import {
  countNodes,
  getNodeDepth,
  cloneNodeWithParent,
} from 'svg-eslint-parser'

const totalNodes = countNodes(ast.body[0])
console.log(`Total nodes: ${totalNodes}`)

const astWithParents = cloneNodeWithParent(ast.body[0])
const depth = getNodeDepth(someNode)
console.log(`Node depth: ${depth}`)
```

## Common Use Cases

### Building an ESLint Rule

```typescript
import type { Rule } from 'eslint'
import { isNodeType, NodeTypes } from 'svg-eslint-parser'

export default {
  create(context) {
    return {
      Tag(node) {
        // node is automatically typed as TagNode
        if (
          node.name === 'circle'
          && !node.attributes.some(a => a.key.value === 'r')
        ) {
          context.report({
            node,
            message: 'Circle elements must have an "r" attribute',
          })
        }
      },
    }
  },
} satisfies Rule.RuleModule
```

### Analyzing SVG Structure

```typescript
import { parseForESLint, findNodeByType, NodeTypes } from 'svg-eslint-parser'

const { ast } = parseForESLint(svgSource)
const document = ast.body[0]

// Get statistics
const tags = findNodeByType(document, NodeTypes.Tag)
const comments = findNodeByType(document, NodeTypes.Comment)

console.log(`Tags: ${tags.length}`)
console.log(`Comments: ${comments.length}`)

// Find all unique tag names
const tagNames = new Set(tags.map(tag => tag.name))
console.log('Tag names:', Array.from(tagNames))
```

### Transforming SVG

```typescript
import { parseForESLint, traverseAST, NodeTypes } from 'svg-eslint-parser'

const { ast } = parseForESLint(svgSource)

// Remove all style attributes
traverseAST(ast.body[0], {
  enter(node) {
    if (node.type === NodeTypes.Tag) {
      node.attributes = node.attributes.filter(
        attr => attr.key.value !== 'style',
      )
    }
  },
})
```

## Troubleshooting

### Issue: "Cannot find module 'svg-eslint-parser'"

**Solution:** Make sure you've installed the package:

```bash
npm install svg-eslint-parser
```

### Issue: "Type errors with AST nodes"

**Solution:** Use the type guard functions:

```typescript
import { isNodeType, NodeTypes } from 'svg-eslint-parser'

if (isNodeType(node, NodeTypes.Tag)) {
  // TypeScript now knows the correct type
}
```

### Issue: "Parent references are undefined"

**Solution:** Parent references are removed by default for performance. Use `cloneNodeWithParent()` if you need them:

```typescript
import { cloneNodeWithParent } from 'svg-eslint-parser'

const astWithParents = cloneNodeWithParent(ast.body[0])
```

### Issue: "ESLint doesn't recognize the parser"

**Solution:** Make sure your ESLint config uses the correct parser reference:

```javascript
import * as parserSVG from 'svg-eslint-parser'

export default [
  {
    files: ['**/*.svg'],
    languageOptions: {
      parser: parserSVG, // Use the entire import
    },
  },
]
```

## Getting Help

- **Documentation**: https://svg-eslint-parser.ntnyq.com
- **Playground**: https://svg-eslint-parser.ntnyq.com/play
- **Issues**: https://github.com/ntnyq/svg-eslint-parser/issues
- **Discussions**: https://github.com/ntnyq/svg-eslint-parser/discussions

## Future Plans

- More utility functions based on community feedback
- Performance optimizations for large SVG files
- Enhanced error recovery and reporting
- Source map support for transformations
