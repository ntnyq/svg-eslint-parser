import type { AnyNode } from '../ast/types'
import type { AnyToken } from '../tokenizer/token'
import type { AnyContextualNode } from './contextualNode'

/**
 * Update a node's end position and location based on a token
 * @param node - Node to update
 * @param token - Token containing the new end position
 */
export function updateNodeEnd(
  node: AnyNode | AnyContextualNode,
  token: AnyToken,
) {
  node.range[1] = token.range[1]
  node.loc.end = {
    ...token.loc.end,
  }
}
