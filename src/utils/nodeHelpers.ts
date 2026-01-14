import type { AnyNode } from '../types'

/**
 * Filter nodes by a predicate function
 * @param node - Root node to filter from
 * @param predicate - Filter function
 * @returns Array of matching nodes
 */
export function filterNodes(
  node: AnyNode,
  predicate: (node: AnyNode) => boolean,
): AnyNode[] {
  const results: AnyNode[] = []

  function traverse(currentNode: AnyNode) {
    if (predicate(currentNode)) {
      results.push(currentNode)
    }

    if ('children' in currentNode && Array.isArray(currentNode.children)) {
      for (const child of currentNode.children) {
        traverse(child)
      }
    }

    if ('attributes' in currentNode && Array.isArray(currentNode.attributes)) {
      for (const attr of currentNode.attributes) {
        traverse(attr as AnyNode)
      }
    }
  }

  traverse(node)
  return results
}

/**
 * Map over all nodes in the AST
 * @param node - Root node to map from
 * @param mapper - Mapping function
 * @returns Transformed node
 */
export function mapNodes<T extends AnyNode>(
  node: T,
  mapper: (node: AnyNode) => AnyNode,
): T {
  const mapped = mapper(node)

  if ('children' in mapped && Array.isArray(mapped.children)) {
    ;(mapped as any).children = mapped.children.map(child =>
      mapNodes(child, mapper),
    )
  }

  if ('attributes' in mapped && Array.isArray(mapped.attributes)) {
    ;(mapped as any).attributes = mapped.attributes.map(attr =>
      mapNodes(attr as AnyNode, mapper),
    )
  }

  return mapped as T
}

/**
 * Get all parent nodes from a node up to the root
 * @param node - Starting node
 * @returns Array of parent nodes (from immediate parent to root)
 */
export function getParentChain(node: any): AnyNode[] {
  const chain: AnyNode[] = []
  let current = node.parentRef || node.parent

  while (current) {
    chain.push(current)
    current = current.parentRef || current.parent
  }

  return chain
}

/**
 * Get the depth of a node in the AST (distance from root)
 * @param node - Node to measure
 * @returns Depth level (root = 0)
 */
export function getNodeDepth(node: any): number {
  let depth = 0
  let current = node.parentRef || node.parent

  while (current) {
    depth++
    current = current.parentRef || current.parent
  }

  return depth
}

/**
 * Count total number of nodes in the AST
 * @param node - Root node
 * @returns Total node count
 */
export function countNodes(node: AnyNode): number {
  let count = 1 // Count current node

  if ('children' in node && Array.isArray(node.children)) {
    for (const child of node.children) {
      count += countNodes(child)
    }
  }

  if ('attributes' in node && Array.isArray(node.attributes)) {
    for (const attr of node.attributes) {
      count += countNodes(attr as AnyNode)
    }
  }

  return count
}
