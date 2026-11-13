import type { ConstructTreeContextTypes } from './constructTreeContextTypes'
import type {
  ConstructTreeContext,
  ConstructTreeNodeMap,
  ConstructTreeState,
} from './constructTreeState'

/**
 * Create a frame with a node valid for its context.
 */
export function createContext<Kind extends ConstructTreeContextTypes>(
  type: Kind,
  node: ConstructTreeNodeMap[NoInfer<Kind>],
  parentRef?: ConstructTreeContext,
): ConstructTreeContext<Kind> {
  // The generic map preserves the type/node correlation of the frame union.
  const context = {
    type,
    node,
    parentRef,
  }
  return context as ConstructTreeContext<Kind>
}

/**
 * Consume exactly one token, optionally entering or leaving a context.
 */
export function consume(
  state: ConstructTreeState,
  context: ConstructTreeContext = state.currentContext,
): ConstructTreeState {
  return {
    ...state,
    currentContext: context,
    caretPosition: state.caretPosition + 1,
  }
}

/**
 * Reprocess the same token in another frame. Progress is checked by the driver.
 */
export function reprocess(
  state: ConstructTreeState,
  context: ConstructTreeContext,
): ConstructTreeState {
  return {
    ...state,
    currentContext: context,
  }
}

/**
 * Restore an ancestor frame, rejecting attempts to leave the document context.
 */
export function getParentContext(
  state: ConstructTreeState,
  levels = 1,
): ConstructTreeContext {
  let context = state.currentContext
  for (let index = 0; index < levels; index++) {
    if (!context.parentRef) {
      throw new Error(`Cannot leave root construction context ${context.type}.`)
    }
    context = context.parentRef
  }
  return context
}
