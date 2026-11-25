/**
 * Existing implementation exports retained for package compatibility.
 * New internal code imports these symbols from their owning modules.
 */

export { findNodeByType } from './ast/findNodesByType'
export { SPECIAL_CHAR } from './tokenizer/specialChar'
export { TokenizerContextTypes } from './tokenizer/tokenizerContextTypes'
export { ConstructTreeContextTypes } from './treeBuilder/constructTreeContextTypes'
export {
  CDATA_END,
  CDATA_START,
  COMMENT_END,
  COMMENT_START,
  PROCESSING_INSTRUCTION_END,
  RE_CLOSE_TAG_NAME,
  RE_INCOMPLETE_CLOSING_TAG,
  RE_OPEN_TAG_NAME,
  RE_OPEN_TAG_START,
  RE_XML_NAME,
  XML_DECLARATION_END,
  XML_DECLARATION_START,
} from './syntax/constants'
export type { ParseResult } from './parser/types'
export type { ErrorContext } from './diagnostics/types'
export type { TokenizerState } from './tokenizer/tokenizerState'
export type { TokenizeHandler } from './tokenizer/tokenizerContextHandler'
export type {
  ConstructTreeContext,
  ConstructTreeNodeMap,
} from './treeBuilder/constructTreeState'
export type {
  AnyContextualNode,
  ConstructTreeHandler,
  ConstructTreeState,
  ContextualAttributeNode,
  ContextualCDATANode,
  ContextualCommentNode,
  ContextualDoctypeAttributeNode,
  ContextualDoctypeNode,
  ContextualDocumentNode,
  ContextualElementNode,
  ContextualNode,
  ContextualXMLDeclarationAttributeNode,
  ContextualXMLDeclarationNode,
  PartialBy,
} from './compat/treeBuilderTypes'
