import type { ConstructTreeContextTypes } from '../constants'
import type { DocumentNode } from './ast'
import type { AnyContextualNode } from './contextualNode'

export type ConstructTreeState<Node extends AnyContextualNode> = {
  caretPosition: number
  currentNode: Node
  rootNode: DocumentNode
  currentContext: {
    type: ConstructTreeContextTypes
    content?: any[]
    parentRef?: any
  }
}
