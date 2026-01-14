import type { AnyNode, Range, SourceLocation } from '../types'

/**
 * Deep clone a node, removing parent references
 * @param node - Node to clone
 * @returns Cloned node
 */
export function cloneNode<T extends AnyNode>(node: T): T {
  if (!node || typeof node !== 'object') {
    return node
  }

  // Clone arrays
  if (Array.isArray(node)) {
    return node.map(item => cloneNode(item)) as any
  }

  // Create new object
  const cloned: any = {}

  for (const key in node) {
    if (!Object.prototype.hasOwnProperty.call(node, key)) {
      continue
    }

    // Skip parent references
    if (key === 'parentRef' || key === 'parent') {
      continue
    }

    const value = node[key]

    // Clone objects recursively
    if (value && typeof value === 'object') {
      if (Array.isArray(value)) {
        cloned[key] = value.map(item => cloneNode(item))
      } else {
        cloned[key] = cloneNode(value as any)
      }
    } else {
      cloned[key] = value
    }
  }

  return cloned as T
}

/**
 * Deep clone a node, preserving parent references
 * @param node - Node to clone
 * @param parent - Parent node for the cloned node
 * @returns Cloned node with parent references
 */
export function cloneNodeWithParent<T extends AnyNode>(
  node: T,
  parent?: AnyNode,
): T {
  if (!node || typeof node !== 'object') {
    return node
  }

  // Clone arrays
  if (Array.isArray(node)) {
    return node.map(item => cloneNodeWithParent(item)) as any
  }

  // Create new object
  const cloned: any = {}

  for (const key in node) {
    if (!Object.prototype.hasOwnProperty.call(node, key)) {
      continue
    }

    // Skip old parent references
    if (key === 'parentRef' || key === 'parent') {
      continue
    }

    const value = node[key]

    // Clone objects recursively
    if (value && typeof value === 'object') {
      if (Array.isArray(value)) {
        cloned[key] = value.map(item => cloneNodeWithParent(item, cloned))
      } else {
        cloned[key] = cloneNodeWithParent(value as any, cloned)
      }
    } else {
      cloned[key] = value
    }
  }

  // Set new parent reference
  if (parent) {
    cloned.parentRef = parent
  }

  return cloned as T
}

/**
 * Create a minimal node with required properties
 * @param type - Node type
 * @param range - Source range
 * @param loc - Source location
 * @returns Minimal node object
 */
export function createMinimalNode(
  type: string,
  range: Range,
  loc: SourceLocation,
): AnyNode {
  return {
    type: type as any,
    range: [...range],
    loc: {
      start: { ...loc.start },
      end: { ...loc.end },
    },
  } as any
}
