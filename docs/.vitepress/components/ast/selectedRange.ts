export function findInObject(
  _iter: object,
  _cursorPosition: number,
  _visited: Set<unknown>,
): {
  key: string[]
  value: unknown
} | null {
  return null
}

export function findSelectionPath(
  node: object,
  cursorPosition: number,
): {
  node: object | null
  path: string[]
} {
  const nodePath = ['ast']
  const visited = new Set<unknown>()
  let currentNode: unknown = node

  while (currentNode) {
    // avoid infinite loop
    if (visited.has(currentNode)) {
      break
    }

    visited.add(currentNode)

    const result = findInObject(currentNode, cursorPosition, visited)

    if (result) {
      currentNode = result.value
      nodePath.push(...result.key)
    } else {
      return {
        node: currentNode,
        path: nodePath,
      }
    }
  }

  return {
    node: null,
    path: nodePath,
  }
}
