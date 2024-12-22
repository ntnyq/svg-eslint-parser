import { visitorKeys } from '../visitorKeys'
import type { AnyNode } from '../types'

type Visitor = (node: AnyNode) => void

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
        value.forEach(n => traverse(n, visitor))
      } else {
        traverse(value, visitor)
      }
    }
  })
}
