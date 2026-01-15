/**
 * Initialize children array if it doesn't exist
 * @param node - Node to initialize
 * @param node.children - Children to set if none exist
 */
export function initChildrenIfNone(node: { children: unknown[] }) {
  if (!node.children) {
    node.children = []
  }
}

/**
 * Initialize attributes array if it doesn't exist
 * @param node - Node to initialize
 * @param node.attributes - Attributes to set if none exist
 */
export function initAttributesIfNone(node: { attributes: unknown[] }) {
  if (!node.attributes) {
    node.attributes = []
  }
}
