import type { AnyToken } from './ast'
import type { ConstructTreeState } from './constructTreeState'

/**
 * Constructor handler for a single AST construction context.
 */
export interface ConstructTreeHandler {
  construct: (
    token: AnyToken,
    state: ConstructTreeState<any>,
  ) => ConstructTreeState<any>
}
