import type { ConstructTreeContextTypes } from '../constants'
import type { DocumentNode } from './ast'
import type { AnyContextualNode } from './contextualNode'

export type ConstructTreeState<N extends AnyContextualNode> = {
  caretPosition: number
  currentNode: N
  rootNode: DocumentNode
  currentContext: {
    type: ConstructTreeContextTypes
    content?: any[]
    parentRef?: any
  }
}
