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
import { findNodeByType, NodeTypes, parseForESLint } from 'svg-eslint-parser'

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
  enter?: (node: AnyNode, parent: AnyNode | null) => void | boolean
  leave?: (node: AnyNode, parent: AnyNode | null) => void
}

function traverseAST(
  node: AnyNode,
  visitor: ASTVisitor,
  parent?: AnyNode | null,
): void
```

The `enter` hook can return `false` to skip visiting children of the current node.
The current node's `leave` hook still runs. Traversal includes the supplied root,
then visits descendants in visitor-key order (element attributes before children).

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

Traversal, search, filtering, and counting use explicit stacks, so these helpers
remain safe for deeply nested SVG documents.

### walkAST()

Simple AST traversal with a callback function.

```typescript
function walkAST(
  node: AnyNode,
  callback: (node: AnyNode, parent: AnyNode | null) => void,
): void
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

Perform shallow checks of `range`, `loc`, and selected fields for elements,
attributes, text, comments, documents, and doctypes. Other node types receive
only the common checks. This does not recursively validate children or establish
that a value fully satisfies an AST interface or XML well-formedness rules.

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

Check whether a node has a specific `type`. The function returns a plain
boolean and does not narrow the node's TypeScript type.

```typescript
function isNodeType<T extends NodeTypes>(node: AnyNode, type: T): boolean
```

**Example:**

```typescript
import { isNodeType, NodeTypes } from 'svg-eslint-parser'

const isElement = isNodeType(node, NodeTypes.Element)
console.log(isElement)

// Compare the discriminant directly when TypeScript narrowing is needed.
if (node.type === NodeTypes.Element) {
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
if (!original) throw new Error('Expected an SVG root element')
const cloned = cloneNode(original)
// cloned is a deep copy without parent references
```

### cloneNodeWithParent()

Deep clone a node, removing existing `parent` and `parentRef` links and creating
new `parentRef` links within the clone. The cloned root has no parent unless the
optional `parent` argument is supplied; in that case, its `parentRef` points to
that argument. This does not recreate ESLint's `parent` property.

```typescript
function cloneNodeWithParent<T extends AnyNode>(node: T, parent?: AnyNode): T
```

**Example:**

```typescript
import { cloneNodeWithParent } from 'svg-eslint-parser'

const cloned = cloneNodeWithParent(node)
// Descendants have parentRef links to their cloned parents.
// The cloned root has no parent.
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

Transform a node tree with a mapper. The mapper must return an AST node, and the
function returns the transformed root with the same static root type.

```typescript
function mapNodes<T extends AnyNode>(
  node: T,
  mapper: (node: AnyNode) => AnyNode,
): T
```

The mapper runs before descendants, and the function updates properties on the
objects it returns. Use `cloneNode()` first to preserve the original and remove
parent cycles. Map `ast.document` when transforming SVG nodes: mapping a
`Program` also visits token and ESLint comment objects because they have a
`type` property.

**Example:**

```typescript
import { cloneNode, mapNodes, NodeTypes } from 'svg-eslint-parser'

const renamed = mapNodes(cloneNode(ast.document), node => {
  if (node.type === NodeTypes.Element && node.name === 'circle') {
    return { ...node, name: 'ellipse' }
  }
  return node
})
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
const depth = getNodeDepth(astWithParents.children[0]!)
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
const ancestors = getParentChain(astWithParents.children[0]!)
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

### Checking AST Node Structure

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
import type { AnyNode } from 'svg-eslint-parser'

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
  enter(node) {
    if (node.type === NodeTypes.Document || node.type === NodeTypes.Element) {
      node.children = node.children.filter(
        child => child.type !== NodeTypes.Comment,
      )
    }
  },
})
```

This changes the document tree only. `ast.comments`, `ast.tokens`, source
locations, and the original SVG source are not regenerated by AST utilities.
