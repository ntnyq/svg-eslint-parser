import type { AnyContextualNode, AnyNode, AnyToken } from '../types'

/**
 * Update a node's end position and location based on a token
 * @param node - Node to update
 * @param token - Token containing the new end position
 */
export function updateNodeEnd(
  node: AnyNode | AnyContextualNode,
  token: AnyToken,
): void {
  node.range[1] = token.range[1]
  node.loc.end = {
    ...token.loc.end,
  }
}
