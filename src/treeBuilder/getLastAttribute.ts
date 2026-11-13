import type { ConstructTreeContextTypes } from './constructTreeContextTypes'
import type {
  ConstructTreeNodeMap,
  ConstructTreeState,
} from './constructTreeState'

type AttributeContext = Exclude<
  ConstructTreeContextTypes,
  | ConstructTreeContextTypes.CDATA
  | ConstructTreeContextTypes.Comment
  | ConstructTreeContextTypes.TagContent
>

/**
 * Get the active attribute from its context's owning node.
 */
export function getLastAttribute<Kind extends AttributeContext>(
  state: ConstructTreeState<Kind>,
): ConstructTreeNodeMap[Kind]['attributes'][number] {
  const attributes = state.currentContext.node.attributes
  const attribute = attributes.at(-1)
  if (!attribute) {
    throw new Error(
      `No active attribute in construction context ${state.currentContext.type}.`,
    )
  }
  return attribute
}
