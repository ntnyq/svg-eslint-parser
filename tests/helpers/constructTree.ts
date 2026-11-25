import { NodeTypes } from '../../src/ast/nodeTypes'
import { ErrorHandler } from '../../src/diagnostics/errorHandler'
import { ConstructTreeContextTypes } from '../../src/treeBuilder/constructTreeContextTypes'
import { createContext } from '../../src/treeBuilder/transitions'
import type {
  AnyToken,
  ConstructTreeContext,
  DocumentNode,
  Locations,
  TokenTypes,
} from '../../src'
import type { ConstructTreeState } from '../../src/treeBuilder/constructTreeState'

export function createLocations(): Locations {
  return {
    range: [0, 1],
    loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 1 } },
  }
}

export function createDocument(): DocumentNode {
  return {
    type: NodeTypes.Document,
    children: [],
    ...createLocations(),
  }
}

export function createState(
  context?: ConstructTreeContext,
): ConstructTreeState {
  const rootNode = createDocument()
  return {
    caretPosition: 0,
    currentContext:
      context ?? createContext(ConstructTreeContextTypes.TagContent, rootNode),
    rootNode,
    errorHandler: new ErrorHandler(),
  }
}

export function createToken(type: TokenTypes, value = 'x'): AnyToken {
  return {
    type,
    value,
    ...createLocations(),
  }
}
