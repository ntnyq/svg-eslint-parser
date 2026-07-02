import { visitorKeys } from '../visitorKeys'
import type { AnyNode } from '../types'

type Visitor = (node: AnyNode) => void

/**
 * Walk an AST node tree using the parser visitor keys.
 * @param node - Root node to visit
 * @param visitor - Callback invoked for each reachable node
 */
export function traverse(node: AnyNode, visitor: Visitor) {
  if (!node) {
    return
  }
  visitor(node)

  const type = node.type
  const keys = visitorKeys[type]

  if (!keys || keys.length <= 0) {
    return
  }

  keys.forEach(key => {
    // @ts-expect-error refine
    const value = node[key]

    if (value) {
      if (Array.isArray(value)) {
        value.forEach(v => traverse(v, visitor))
      } else {
        traverse(value, visitor)
      }
    }
  })
}
