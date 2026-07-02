import type { ConstructTreeContextTypes } from '../constants'
import type { DocumentNode } from './ast'
import type { AnyContextualNode } from './contextualNode'
import type { ErrorContext } from './errors'

/**
 * Mutable state shared by AST construction handlers.
 */
export type ConstructTreeState<Node extends AnyContextualNode> = {
  caretPosition: number
  currentNode: Node
  errorHandler: ErrorContext
  rootNode: DocumentNode
  currentContext: {
    type: ConstructTreeContextTypes
    content?: any[]
    parentRef?: any
  }
}
