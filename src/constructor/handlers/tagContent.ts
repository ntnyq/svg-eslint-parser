import { ConstructTreeContextTypes, NodeTypes, TokenTypes } from '../../constants'
import {
  cloneLocation,
  cloneRange,
  createNodeFrom,
  initChildrenIfNone,
  parseCloseTagName,
} from '../../utils'
import type {
  AnyToken,
  ConstructTreeState,
  ContextualCommentNode,
  ContextualDoctypeNode,
  ContextualDocumentNode,
  ContextualTagNode,
  TextNode,
  Token,
} from '../../types'

export function construct(token: AnyToken, state: ConstructTreeState<ContextualTagNode>) {
  if (token.type === TokenTypes.OpenTagStart) {
    return handleOpenTagStart(state, token)
  }

  if (token.type === TokenTypes.Text) {
    return handleText(state, token)
  }

  if (token.type === TokenTypes.CloseTag) {
    return handleCloseTag(state, token)
  }

  if (token.type === TokenTypes.CommentOpen) {
    return handleCommentOpen(state, token)
  }

  if (token.type === TokenTypes.DoctypeOpen) {
    return handleDoctypeOpen(state, token)
  }

  state.caretPosition++

  return state
}

function handleOpenTagStart(state: ConstructTreeState<ContextualTagNode>, token: AnyToken) {
  initChildrenIfNone(state.currentNode)

  const tagNode: ContextualTagNode = {
    type: NodeTypes.Tag,
    parentRef: state.currentNode,
    range: cloneRange(token.range),
    loc: cloneLocation(token.loc),
    attributes: [],
    children: [],
  }

  state.currentNode.children.push(tagNode)
  state.currentNode = tagNode

  state.currentContext = {
    parentRef: state.currentContext,
    type: ConstructTreeContextTypes.Tag,
  }

  return state
}

function handleText(
  state: ConstructTreeState<ContextualTagNode | ContextualDocumentNode>,
  token: Token<TokenTypes.Text>,
) {
  initChildrenIfNone(state.currentNode)

  const textNode = createNodeFrom(token) as TextNode

  state.currentNode.children.push(textNode)
  state.caretPosition++

  return state
}

function handleCloseTag(state: ConstructTreeState<ContextualTagNode>, token: AnyToken) {
  const closeTagName = parseCloseTagName(token.value)

  if (closeTagName !== state.currentNode.name) {
    state.caretPosition++

    return state
  }

  state.currentContext = state.currentContext.parentRef

  return state
}

function handleCommentOpen(state: ConstructTreeState<ContextualTagNode>, token: AnyToken) {
  initChildrenIfNone(state.currentNode)

  const commentNode: ContextualCommentNode = {
    type: NodeTypes.Comment,
    parentRef: state.currentNode,
    range: cloneRange(token.range),
    loc: cloneLocation(token.loc),
  }

  state.currentNode.children.push(commentNode)

  // @ts-expect-error comment node not match
  state.currentNode = commentNode
  state.currentContext = {
    parentRef: state.currentContext,
    type: ConstructTreeContextTypes.Comment,
  }

  return state
}

function handleDoctypeOpen(
  state: ConstructTreeState<ContextualTagNode | ContextualDocumentNode>,
  token: AnyToken,
) {
  initChildrenIfNone(state.currentNode)

  const doctypeNode: ContextualDoctypeNode = {
    type: NodeTypes.Doctype,
    parentRef: state.currentNode,
    range: cloneRange(token.range),
    loc: cloneLocation(token.loc),
    attributes: [],
  }

  // @ts-expect-error doctype node not match
  state.currentNode.children.push(doctypeNode)

  // @ts-expect-error doctype node not match
  state.currentNode = doctypeNode
  state.currentContext = {
    parentRef: state.currentContext,
    type: ConstructTreeContextTypes.Doctype,
  }

  return state
}
