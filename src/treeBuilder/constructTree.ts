import { NodeTypes } from '../ast/nodeTypes'
import { ErrorHandler } from '../diagnostics/errorHandler'
import { ParseErrorType } from '../diagnostics/types'
import { cloneLocation } from '../source/cloneLocation'
import { cloneRange } from '../source/cloneRange'
import { getLineInfo } from '../source/lineIndex'
import { ConstructTreeContextTypes } from './constructTreeContextTypes'
import {
  attribute,
  attributes,
  attributeValue,
  cdata,
  comment,
  doctype,
  doctypeAttribute,
  doctypeAttributes,
  tag,
  tagContent,
  tagName,
  xmlDeclaration,
  xmlDeclarationAttribute,
  xmlDeclarationAttributes,
  xmlDeclarationAttributeValue,
} from './handlers'
import { processTokens } from './processTokens'
import { createContext } from './transitions'
import type { Range, SourceLocation } from '../source/types'
import type { AnyToken } from '../tokenizer/token'
import type {
  ConstructTreeContext,
  ConstructTreeState,
} from './constructTreeState'
import type { ContextualDocumentNode } from './contextualNode'
import type { ConstructTreeHandlers } from './processTokens'

const EMPTY_LOC: SourceLocation = {
  start: {
    line: 1,
    column: 0,
  },
  end: {
    line: 1,
    column: 0,
  },
}

const contextHandlers: ConstructTreeHandlers = {
  [ConstructTreeContextTypes.Tag]: tag,
  [ConstructTreeContextTypes.TagName]: tagName,
  [ConstructTreeContextTypes.TagContent]: tagContent,
  [ConstructTreeContextTypes.Attributes]: attributes,
  [ConstructTreeContextTypes.Attribute]: attribute,
  [ConstructTreeContextTypes.AttributeValue]: attributeValue,
  [ConstructTreeContextTypes.CDATA]: cdata,
  [ConstructTreeContextTypes.Doctype]: doctype,
  [ConstructTreeContextTypes.DoctypeAttribute]: doctypeAttribute,
  [ConstructTreeContextTypes.DoctypeAttributes]: doctypeAttributes,
  [ConstructTreeContextTypes.Comment]: comment,
  [ConstructTreeContextTypes.XMLDeclaration]: xmlDeclaration,
  [ConstructTreeContextTypes.XMLDeclarationAttribute]: xmlDeclarationAttribute,
  [ConstructTreeContextTypes.XMLDeclarationAttributes]:
    xmlDeclarationAttributes,
  [ConstructTreeContextTypes.XMLDeclarationAttributeValue]:
    xmlDeclarationAttributeValue,
}

function reportUnclosedNodes(state: ConstructTreeState) {
  let context: ConstructTreeContext | undefined = state.currentContext
  while (context) {
    if (context.type === ConstructTreeContextTypes.Tag) {
      const node = context.node
      if (!node.selfClosing && !node.close) {
        node.range[1] = state.rootNode.range[1]
        node.loc.end = { ...state.rootNode.loc.end }
        state.errorHandler.addError({
          type: ParseErrorType.UnclosedTag,
          message: `Unclosed tag "${node.name ?? 'unknown'}".`,
          range: cloneRange(node.range),
          loc: cloneLocation(node.loc),
          recovery: 'The parser kept the partial element in the AST.',
        })
      }
    }
    context = context.parentRef
  }
}

/**
 * Build the document AST from tokenizer output.
 * @param tokens - Tokens produced from SVG source
 * @returns Constructed AST, final constructor state, and recoverable diagnostics
 */
export function constructTree(tokens: AnyToken[], source: string) {
  const range: Range = [0, source.length]
  const loc: SourceLocation =
    source.length > 0
      ? {
          start: { ...EMPTY_LOC.start },
          end: getLineInfo(source, source.length),
        }
      : cloneLocation(EMPTY_LOC)

  const rootNode: ContextualDocumentNode = {
    type: NodeTypes.Document,
    range,
    children: [],
    loc,
  }
  const state: ConstructTreeState = {
    caretPosition: 0,
    currentContext: createContext(
      ConstructTreeContextTypes.TagContent,
      rootNode,
    ),
    errorHandler: new ErrorHandler(),
    rootNode,
  }

  const finalState = processTokens(tokens, state, contextHandlers)
  reportUnclosedNodes(finalState)

  return {
    state: finalState,
    ast: state.rootNode,
    errors: state.errorHandler.getErrors(),
    warnings: state.errorHandler.getWarnings(),
  }
}
