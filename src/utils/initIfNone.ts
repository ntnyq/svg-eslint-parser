export function initChildrenIfNone(node: { children: unknown[] }) {
  if (!node.children) {
    node.children = []
  }
}

export function initAttributesIfNone(node: { attributes: unknown[] }) {
  if (!node.attributes) {
    node.attributes = []
  }
}
