import { last } from './firstLast'
import type {
  AttributeNode,
  ConstructTreeState,
  ContextualDoctypeNode,
  ContextualTagNode,
  DoctypeAttributeNode,
  XMLDeclarationAttributeNode,
} from '../types'

/**
 * Get the last attribute from a node's attributes array
 * Supports multiple node types with overloads for type safety
 * @param state - Constructor state containing the current node
 * @returns The last attribute in the node's attributes array
 */
export function getLastAttribute(
  state: ConstructTreeState<ContextualTagNode>,
): AttributeNode
export function getLastAttribute(
  state: ConstructTreeState<ContextualDoctypeNode>,
): DoctypeAttributeNode
export function getLastAttribute(
  state: ConstructTreeState<XMLDeclarationAttributeNode>,
): XMLDeclarationAttributeNode
export function getLastAttribute(state: ConstructTreeState<any>) {
  const attributes = state.currentNode.attributes
  return last(attributes)
}
