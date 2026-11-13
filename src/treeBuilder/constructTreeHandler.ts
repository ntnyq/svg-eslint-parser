import type { AnyToken } from '../tokenizer/token'
import type { ConstructTreeContextTypes } from './constructTreeContextTypes'
import type { ConstructTreeState } from './constructTreeState'

/**
 * Context-tagged handler used by the exhaustive construction dispatch table.
 */
export type ConstructTreeHandler<
  Kind extends ConstructTreeContextTypes = ConstructTreeContextTypes,
> = ((token: AnyToken, state: ConstructTreeState) => ConstructTreeState) & {
  readonly contextType: Kind
}
