import type { AnyToken } from './ast'
import type { ConstructTreeState } from './constructTreeState'

export interface ConstructTreeHandler {
  construct: (token: AnyToken, state: ConstructTreeState<any>) => ConstructTreeState<any>
}
