import { ConstructTreeContextTypes, NodeTypes } from '../constants'
import { ErrorHandler } from '../parser/errorHandler'
import { ParseErrorType } from '../types'
import { cloneLocation, cloneRange, first, last } from '../utils'
import {
  attribute,
  attributes,
  attributeValue,
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
import type {
  AnyToken,
  ConstructTreeHandler,
  ConstructTreeState,
  ContextualDocumentNode,
  DocumentNode,
  Range,
  SourceLocation,
} from '../types'

const EMPTY_RANGE: Range = [0, 0]
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

const contextHandlers: Record<ConstructTreeContextTypes, ConstructTreeHandler> =
  {
    [ConstructTreeContextTypes.Tag]: tag,
    [ConstructTreeContextTypes.TagName]: tagName,
    [ConstructTreeContextTypes.TagContent]: tagContent,
    [ConstructTreeContextTypes.Attributes]: attributes,
    [ConstructTreeContextTypes.Attribute]: attribute,
    [ConstructTreeContextTypes.AttributeValue]: attributeValue,
    [ConstructTreeContextTypes.Doctype]: doctype,
    [ConstructTreeContextTypes.DoctypeAttribute]: doctypeAttribute,
    [ConstructTreeContextTypes.DoctypeAttributes]: doctypeAttributes,
    [ConstructTreeContextTypes.Comment]: comment,
    [ConstructTreeContextTypes.XMLDeclaration]: xmlDeclaration,
    [ConstructTreeContextTypes.XMLDeclarationAttribute]:
      xmlDeclarationAttribute,
    [ConstructTreeContextTypes.XMLDeclarationAttributes]:
      xmlDeclarationAttributes,
    [ConstructTreeContextTypes.XMLDeclarationAttributeValue]:
      xmlDeclarationAttributeValue,
  }

function processTokens(
  tokens: AnyToken[],
  state: ConstructTreeState<any>,
  positionOffset: number,
) {
  let tokenIndex = state.caretPosition - positionOffset

  while (tokenIndex < tokens.length) {
    const token = tokens[tokenIndex]
    const handler = contextHandlers[state.currentContext.type].construct
    // oxlint-disable-next-line no-param-reassign
    state = handler(token, state)
    tokenIndex = state.caretPosition - positionOffset
  }

  return state
}

function reportUnclosedNodes(state: ConstructTreeState<any>) {
  let node = state.currentNode

  while (node && node !== state.rootNode) {
    if (node.type === NodeTypes.Element && !node.selfClosing && !node.close) {
      state.errorHandler.addError({
        type: ParseErrorType.UnclosedTag,
        message: `Unclosed tag "${node.name ?? 'unknown'}".`,
        range: cloneRange(node.range),
        loc: cloneLocation(node.loc),
        recovery: 'The parser kept the partial element in the AST.',
      })
    }

    node = node.parentRef
  }
}

/**
 * Build the document AST from tokenizer output.
 * @param tokens - Tokens produced from SVG source
 * @returns Constructed AST, final constructor state, and recoverable diagnostics
 */
export function constructTree(tokens: AnyToken[]) {
  const rootContext: ConstructTreeState<ContextualDocumentNode>['currentContext'] =
    {
      type: ConstructTreeContextTypes.TagContent,
      parentRef: undefined,
      content: [],
    }

  const lastToken = last(tokens)
  const firstToken = first(tokens)
  const range: Range = lastToken ? [0, lastToken.range[1]] : EMPTY_RANGE
  const loc =
    lastToken && firstToken
      ? {
          start: cloneLocation(firstToken.loc).start,
          end: cloneLocation(lastToken.loc).end,
        }
      : EMPTY_LOC

  loc.start.line = 1

  const rootNode: DocumentNode = {
    type: NodeTypes.Document,
    range,
    children: [],
    loc,
  }
  const state: ConstructTreeState<ContextualDocumentNode> = {
    caretPosition: 0,
    currentContext: rootContext,
    currentNode: rootNode,
    errorHandler: new ErrorHandler(),
    rootNode,
  }

  const positionOffset = state.caretPosition

  const finalState = processTokens(tokens, state, positionOffset)
  reportUnclosedNodes(finalState)

  return {
    state,
    ast: state.rootNode,
    errors: state.errorHandler.getErrors(),
    warnings: state.errorHandler.getWarnings(),
  }
}
