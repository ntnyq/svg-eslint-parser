import {
  ConstructTreeContextTypes,
  NodeTypes,
  TokenTypes,
} from '../../constants'
import {
  cloneLocation,
  cloneRange,
  createNodeFrom,
  initChildrenIfNone,
  parseCloseTagName,
} from '../../utils'
import { createTokenDispatcher } from '../handlerFactory'
import type {
  AnyToken,
  ConstructTreeState,
  ContextualCommentNode,
  ContextualDoctypeNode,
  ContextualTagNode,
  TextNode,
} from '../../types'

const dispatch = createTokenDispatcher(
  [
    {
      tokenType: TokenTypes.OpenTagStart,
      handler: (token, state) => {
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
      },
    },
    {
      tokenType: TokenTypes.Text,
      handler: (token, state) => {
        initChildrenIfNone(state.currentNode)
        const textNode = createNodeFrom(token) as TextNode
        state.currentNode.children.push(textNode)
        state.caretPosition++
        return state
      },
    },
    {
      tokenType: TokenTypes.CloseTag,
      handler: (token, state) => {
        const closeTagName = parseCloseTagName(token.value)
        if (closeTagName !== state.currentNode.name) {
          state.caretPosition++
          return state
        }
        state.currentContext = state.currentContext.parentRef
        return state
      },
    },
    {
      tokenType: TokenTypes.CommentOpen,
      handler: (token, state) => {
        initChildrenIfNone(state.currentNode)
        const commentNode: ContextualCommentNode = {
          type: NodeTypes.Comment,
          parentRef: state.currentNode,
          range: cloneRange(token.range),
          loc: cloneLocation(token.loc),
        }
        state.currentNode.children.push(commentNode)
        state.currentNode = commentNode as any
        state.currentContext = {
          parentRef: state.currentContext,
          type: ConstructTreeContextTypes.Comment,
        }
        return state
      },
    },
    {
      tokenType: TokenTypes.DoctypeOpen,
      handler: (token, state) => {
        initChildrenIfNone(state.currentNode)
        const doctypeNode: ContextualDoctypeNode = {
          type: NodeTypes.Doctype,
          parentRef: state.currentNode,
          range: cloneRange(token.range),
          loc: cloneLocation(token.loc),
          attributes: [],
        }
        state.currentNode.children.push(doctypeNode as any)
        state.currentNode = doctypeNode as any
        state.currentContext = {
          parentRef: state.currentContext,
          type: ConstructTreeContextTypes.Doctype,
        }
        return state
      },
    },
  ],
  (_, state) => {
    state.caretPosition++
    return state
  },
)

export function construct(
  token: AnyToken,
  state: ConstructTreeState<ContextualTagNode>,
) {
  return dispatch(token, state)
}
