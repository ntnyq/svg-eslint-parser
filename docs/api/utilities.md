# Utilities

The parser provides a comprehensive set of utility functions for working with the AST.

## Search & Traversal

### findNodeByType()

Find all nodes of a specific type in the AST.

```typescript
function findNodeByType<T extends NodeTypes>(
  node: AnyNode,
  type: T,
): Array<Extract<AnyNode, { type: T }>>
```

**Example:**

```typescript
import { parseForESLint } from 'svg-eslint-parser'
import { findNodeByType, NodeTypes } from 'svg-eslint-parser'

const { ast } = parseForESLint('<svg><circle /></svg>')
const tags = findNodeByType(ast.document, NodeTypes.Element)
// Returns all Element nodes in the AST
```

### findFirstNodeByType()

Find the first node of a specific type in the AST.

```typescript
function findFirstNodeByType<T extends NodeTypes>(
  node: AnyNode,
  type: T,
): Extract<AnyNode, { type: T }> | undefined
```

**Example:**

```typescript
const firstTag = findFirstNodeByType(ast.document, NodeTypes.Element)
// Returns the first Element node or undefined
```

### traverseAST()

Traverse the AST using the visitor pattern with enter and leave hooks.

```typescript
interface ASTVisitor {
  enter?: (node: AnyNode, parent?: AnyNode) => void | boolean
  leave?: (node: AnyNode, parent?: AnyNode) => void
}

function traverseAST(node: AnyNode, visitor: ASTVisitor, parent?: AnyNode): void
```

The `enter` hook can return `false` to skip visiting children of the current node.

**Example:**

```typescript
import { traverseAST } from 'svg-eslint-parser'

traverseAST(ast.document, {
  enter(node, parent) {
    console.log('Entering:', node.type)
    // Return false to skip children
    if (node.type === 'Comment') return false
  },
  leave(node, parent) {
    console.log('Leaving:', node.type)
  },
})
```

### walkAST()

Simple AST traversal with a callback function.

```typescript
function walkAST(node: AnyNode, callback: (node: AnyNode) => void): void
```

**Example:**

```typescript
import { walkAST } from 'svg-eslint-parser'

const nodeTypes = new Set<string>()
walkAST(ast.document, node => {
  nodeTypes.add(node.type)
})
```

## Validation & Type Checking

### validateNode()

Validate that a node has the correct structure for its type.

```typescript
function validateNode(node: AnyNode): boolean
```

**Example:**

```typescript
import { validateNode } from 'svg-eslint-parser'

const isValid = validateNode(node)
if (!isValid) {
  console.error('Invalid node structure')
}
```

### isNodeType()

Type guard function to check if a node is of a specific type.

```typescript
function isNodeType<T extends NodeTypes>(
  node: AnyNode,
  type: T,
): node is Extract<AnyNode, { type: T }>
```

**Example:**

```typescript
import { isNodeType, NodeTypes } from 'svg-eslint-parser'

if (isNodeType(node, NodeTypes.Element)) {
  // TypeScript knows node is a ElementNode here
  console.log('Element name:', node.name)
}
```

## AST Manipulation

### cloneNode()

Deep clone a node, removing all parent references.

```typescript
function cloneNode<T extends AnyNode>(node: T): T
```

**Example:**

```typescript
import { cloneNode } from 'svg-eslint-parser'

const original = findFirstNodeByType(ast.document, NodeTypes.Element)
const cloned = cloneNode(original)
// cloned is a deep copy without parent references
```

### cloneNodeWithParent()

Deep clone a node while preserving parent references.

```typescript
function cloneNodeWithParent<T extends AnyNode>(node: T, parent?: AnyNode): T
```

**Example:**

```typescript
import { cloneNodeWithParent } from 'svg-eslint-parser'

const cloned = cloneNodeWithParent(node)
// cloned preserves the tree structure with parent references
```

### filterNodes()

Filter nodes in the AST by a predicate function.

```typescript
function filterNodes(
  node: AnyNode,
  predicate: (node: AnyNode) => boolean,
): AnyNode[]
```

**Example:**

```typescript
import { filterNodes } from 'svg-eslint-parser'

// Find all tags with width attribute
const tagsWithWidth = filterNodes(ast.document, node => {
  return (
    node.type === 'Element' &&
    node.attributes.some(attr => attr.key.value === 'width')
  )
})
```

### mapNodes()

Transform all nodes in the AST using a mapper function.

```typescript
function mapNodes<T>(node: AnyNode, mapper: (node: AnyNode) => T): T[]
```

**Example:**

```typescript
import { mapNodes } from 'svg-eslint-parser'

// Extract all node types
const types = mapNodes(ast.document, node => node.type)
```

## Analysis

### countNodes()

Count the total number of nodes in the AST.

```typescript
function countNodes(node: AnyNode): number
```

**Example:**

```typescript
import { countNodes } from 'svg-eslint-parser'

const total = countNodes(ast.document)
console.log(`AST contains ${total} nodes`)
```

### getNodeDepth()

Get the depth of a node in the AST (distance from root).

**Note:** This function requires parent references to be present. Use `cloneNodeWithParent()` first if your AST doesn't have parent references.

```typescript
function getNodeDepth(node: AnyNode): number
```

**Example:**

```typescript
import { getNodeDepth, cloneNodeWithParent } from 'svg-eslint-parser'

const astWithParents = cloneNodeWithParent(ast.document)
const depth = getNodeDepth(someNode)
// Returns 0 for root, 1 for direct children, etc.
```

### getParentChain()

Get the chain of ancestor nodes from the current node to the root.

**Note:** This function requires parent references to be present.

```typescript
function getParentChain(node: AnyNode): AnyNode[]
```

**Example:**

```typescript
import { getParentChain, cloneNodeWithParent } from 'svg-eslint-parser'

const astWithParents = cloneNodeWithParent(ast.document)
const ancestors = getParentChain(someNode)
// Returns [parent, grandparent, ..., root]
```

## Common Usage Patterns

### Finding All Elements with a Specific Attribute

```typescript
import { parseForESLint, findNodeByType, NodeTypes } from 'svg-eslint-parser'

const { ast } = parseForESLint(svgSource)
const document = ast.document

// Find all tags with 'id' attribute
const tagsWithId = findNodeByType(document, NodeTypes.Element).filter(tag =>
  tag.attributes.some(attr => attr.key.value === 'id'),
)
```

### Collecting All Text Content

```typescript
import { parseForESLint, findNodeByType, NodeTypes } from 'svg-eslint-parser'

const { ast } = parseForESLint(svgSource)
const document = ast.document

const textNodes = findNodeByType(document, NodeTypes.Text)
const allText = textNodes.map(node => node.value).join('')
```

### Validating SVG Structure

```typescript
import { parseForESLint, traverseAST, validateNode } from 'svg-eslint-parser'

const { ast } = parseForESLint(svgSource)

let hasErrors = false
traverseAST(ast.document, {
  enter(node) {
    if (!validateNode(node)) {
      console.error(`Invalid node: ${node.type}`)
      hasErrors = true
    }
  },
})
```

### Building a Node Index

```typescript
import { parseForESLint, walkAST, NodeTypes } from 'svg-eslint-parser'

const { ast } = parseForESLint(svgSource)

const index = new Map<string, AnyNode[]>()
walkAST(ast.document, node => {
  const nodes = index.get(node.type) || []
  nodes.push(node)
  index.set(node.type, nodes)
})

// Now you can quickly access all nodes of a specific type
const allTags = index.get(NodeTypes.Element) || []
```

### Transforming the AST

```typescript
import { parseForESLint, traverseAST, NodeTypes } from 'svg-eslint-parser'

const { ast } = parseForESLint(svgSource)

// Remove all comments from the AST
traverseAST(ast.document, {
  enter(node, parent) {
    if (
      node.type === NodeTypes.Comment &&
      parent?.type === NodeTypes.Document
    ) {
      const index = parent.children.indexOf(node)
      if (index !== -1) {
        parent.children.splice(index, 1)
      }
    }
  },
})
```
