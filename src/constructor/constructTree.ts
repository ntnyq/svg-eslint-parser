import { ConstructTreeContextTypes, NodeTypes } from '../constants'
import { cloneLocation, first, last } from '../utils'
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
  AnyContextualNode,
  AnyToken,
  ConstructTreeHandler,
  ConstructTreeState,
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

export function constructTree<ContextualNode extends AnyContextualNode = any>(
  tokens: AnyToken[],
) {
  const rootContext: ConstructTreeState<ContextualNode>['currentContext'] = {
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
  const state: ConstructTreeState<ContextualNode> = {
    caretPosition: 0,
    currentContext: rootContext,
    // @ts-expect-error TODO: fix type
    currentNode: rootNode,
    rootNode,
  }

  const positionOffset = state.caretPosition

  processTokens(tokens, state, positionOffset)

  return {
    state,
    ast: state.rootNode,
  }
}

function processTokens<ContextualNode extends AnyContextualNode = any>(
  tokens: AnyToken[],
  state: ConstructTreeState<ContextualNode>,
  positionOffset: number,
) {
  let tokenIndex = state.caretPosition - positionOffset

  while (tokenIndex < tokens.length) {
    const token = tokens[tokenIndex]
    const handler = contextHandlers[state.currentContext.type].construct
    state = handler(token, state)
    tokenIndex = state.caretPosition - positionOffset
  }

  return state
}
