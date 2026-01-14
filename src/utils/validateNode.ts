import { NodeTypes } from '../constants'
import type { AnyNode } from '../types'

/**
 * Validate if a node matches its expected structure
 * @param node - Node to validate
 * @returns True if node is valid
 */
export function validateNode(node: AnyNode): boolean {
  if (!node || typeof node !== 'object') {
    return false
  }

  // Check for required properties
  if (!('type' in node) || !('range' in node) || !('loc' in node)) {
    return false
  }

  // Validate range
  if (
    !Array.isArray(node.range)
    || node.range.length !== 2
    || typeof node.range[0] !== 'number'
    || typeof node.range[1] !== 'number'
  ) {
    return false
  }

  // Validate location
  if (
    !node.loc
    || !node.loc.start
    || !node.loc.end
    || typeof node.loc.start.line !== 'number'
    || typeof node.loc.start.column !== 'number'
    || typeof node.loc.end.line !== 'number'
    || typeof node.loc.end.column !== 'number'
  ) {
    return false
  }

  // Type-specific validation
  switch (node.type) {
    case NodeTypes.Tag:
      return validateTagNode(node)
    case NodeTypes.Attribute:
      return validateAttributeNode(node)
    case NodeTypes.Text:
      return validateTextNode(node)
    case NodeTypes.Comment:
      return validateCommentNode(node)
    case NodeTypes.Document:
      return validateDocumentNode(node)
    case NodeTypes.Doctype:
      return validateDoctypeNode(node)
    default:
      return true // Unknown types are considered valid
  }
}

function validateTagNode(node: AnyNode): boolean {
  if (!('name' in node) || typeof node.name !== 'string') {
    return false
  }

  if ('children' in node && !Array.isArray(node.children)) {
    return false
  }

  if ('attributes' in node && !Array.isArray(node.attributes)) {
    return false
  }

  return true
}

function validateAttributeNode(node: AnyNode): boolean {
  // Attribute can have key and/or value
  if ('key' in node && node.key !== undefined && typeof node.key !== 'object') {
    return false
  }

  if (
    'value' in node
    && node.value !== undefined
    && typeof node.value !== 'object'
  ) {
    return false
  }

  return true
}

function validateTextNode(node: AnyNode): boolean {
  return 'value' in node && typeof node.value === 'string'
}

function validateCommentNode(node: AnyNode): boolean {
  return 'content' in node && typeof node.content === 'string'
}

function validateDocumentNode(node: AnyNode): boolean {
  return 'children' in node && Array.isArray(node.children)
}

function validateDoctypeNode(node: AnyNode): boolean {
  if ('attributes' in node && !Array.isArray(node.attributes)) {
    return false
  }

  return true
}

/**
 * Check if a node is of a specific type with type guard
 * @param node - Node to check
 * @param type - Expected node type
 * @returns True if node is of the specified type
 */
export function isNodeType<T extends NodeTypes>(
  node: AnyNode,
  type: T,
): boolean {
  return node.type === type
}
