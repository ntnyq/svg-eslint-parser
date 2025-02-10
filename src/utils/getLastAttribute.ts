import { last } from './firstLast'
import type {
  AttributeNode,
  ConstructTreeState,
  ContextualDoctypeNode,
  ContextualTagNode,
  DoctypeAttributeNode,
} from '../types'

export function getLastAttribute(
  state: ConstructTreeState<ContextualTagNode>,
): AttributeNode
export function getLastAttribute(
  state: ConstructTreeState<ContextualDoctypeNode>,
): DoctypeAttributeNode
export function getLastAttribute(state: ConstructTreeState<any>) {
  const attributes = state.currentNode.attributes
  return last(attributes)
}
