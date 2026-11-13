import { walkAST } from './traverseAST'
import type { Range, SourceLocation } from '../source/types'
import type { AnyNode } from './types'

/**
 * Deep clone a node, removing parent references
 * @param node - Node to clone
 * @returns Cloned node
 */
export function cloneNode<T extends AnyNode>(node: T): T {
  if (!node || typeof node !== 'object') {
    return node
  }

  const cloned: object = Array.isArray(node) ? [] : {}
  const copies = new WeakMap<object, object>([[node, cloned]])
  const stack: { source: object; target: object }[] = [
    { source: node, target: cloned },
  ]

  while (stack.length > 0) {
    const frame = stack.pop()
    if (!frame) {
      continue
    }

    const properties: [string, unknown][] = Object.entries(frame.source)
    for (const [key, value] of properties) {
      if (key === 'parentRef' || key === 'parent') {
        continue
      }
      let copy: unknown = value

      if (value && typeof value === 'object') {
        copy = copies.get(value)
        if (!copy) {
          const target: object = Array.isArray(value) ? [] : {}
          copies.set(value, target)
          stack.push({ source: value, target })
          copy = target
        }
      }

      Object.defineProperty(frame.target, key, {
        value: copy,
        enumerable: true,
        configurable: true,
        writable: true,
      })
    }
  }

  return cloned as T
}

/**
 * Deep clone a node and rebuild parentRef links only between AST nodes.
 * @param node - Node to clone
 * @param parent - Parent node for the cloned node
 * @returns Cloned node with parent references
 */
export function cloneNodeWithParent<T extends AnyNode>(
  node: T,
  parent?: AnyNode,
): T {
  const cloned = cloneNode(node)
  walkAST(cloned, (current, ancestor) => {
    const parentNode = ancestor ?? parent
    if (parentNode) {
      Reflect.set(current, 'parentRef', parentNode)
    }
  })

  return cloned
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
