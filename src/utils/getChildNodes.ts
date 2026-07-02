import { visitorKeys } from '../visitorKeys'
import type { AnyNode } from '../types'

/**
 * Get child AST nodes according to the parser visitor keys.
 * @param node - Parent AST node
 * @returns Child nodes in visitor-key order
 */
export function getChildNodes(node: AnyNode): AnyNode[] {
  const keys = visitorKeys[node.type] ?? []
  const children: AnyNode[] = []

  for (const key of keys) {
    const value = node[key as keyof AnyNode]

    if (Array.isArray(value)) {
      children.push(...(value as unknown as AnyNode[]))
    } else if (value) {
      children.push(value as unknown as AnyNode)
    }
  }

  return children
}
