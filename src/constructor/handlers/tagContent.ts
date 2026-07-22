import {
  ConstructTreeContextTypes,
  NodeTypes,
  TokenTypes,
} from '../../constants'
import { ParseErrorType } from '../../types'
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
  ContextualCDATANode,
  ContextualCommentNode,
  ContextualDoctypeNode,
  ContextualElementNode,
  ContextualXMLDeclarationNode,
  TextNode,
} from '../../types'

function addUnclosedTagError(
  state: ConstructTreeState<any>,
  node: ContextualElementNode,
) {
  state.errorHandler.addError({
    type: ParseErrorType.UnclosedTag,
    message: `Unclosed tag "${node.name ?? 'unknown'}".`,
    range: cloneRange(node.range),
    loc: cloneLocation(node.loc),
    recovery: 'The parser kept the partial element in the AST.',
  })
}

const dispatch = createTokenDispatcher(
  [
    {
      tokenType: TokenTypes.CDATAOpen,
      handler(token, state) {
        initChildrenIfNone(state.currentNode)
        const cdataNode: ContextualCDATANode = {
          type: NodeTypes.CDATA,
          parentRef: state.currentNode,
          range: cloneRange(token.range),
          loc: cloneLocation(token.loc),
        }
        state.currentNode.children.push(cdataNode)
        state.currentNode = cdataNode as any
        state.currentContext = {
          parentRef: state.currentContext,
          type: ConstructTreeContextTypes.CDATA,
        }
        return state
      },
    },
    {
      tokenType: TokenTypes.XMLDeclarationOpen,
      handler(token, state) {
        if (state.currentNode.type !== NodeTypes.Document) {
          state.caretPosition++
          return state
        }
        initChildrenIfNone(state.currentNode)
        const declarationNode: ContextualXMLDeclarationNode = {
          type: NodeTypes.XMLDeclaration,
          parentRef: state.currentNode,
          range: cloneRange(token.range),
          loc: cloneLocation(token.loc),
          attributes: [],
        }
        state.currentNode.children.push(declarationNode)
        state.currentNode = declarationNode as any
        state.currentContext = {
          parentRef: state.currentContext,
          type: ConstructTreeContextTypes.XMLDeclaration,
        }
        return state
      },
    },
    {
      tokenType: TokenTypes.OpenTagStart,
      handler(token, state) {
        initChildrenIfNone(state.currentNode)
        const elementNode: ContextualElementNode = {
          type: NodeTypes.Element,
          parentRef: state.currentNode,
          range: cloneRange(token.range),
          loc: cloneLocation(token.loc),
          attributes: [],
          children: [],
        }
        state.currentNode.children.push(elementNode)
        state.currentNode = elementNode
        state.currentContext = {
          parentRef: state.currentContext,
          type: ConstructTreeContextTypes.Tag,
        }
        return state
      },
    },
    {
      tokenType: TokenTypes.DoctypeOpen,
      handler(token, state) {
        if (state.currentNode.type !== NodeTypes.Document) {
          state.caretPosition++
          return state
        }
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
    {
      tokenType: TokenTypes.Text,
      handler(token, state) {
        initChildrenIfNone(state.currentNode)
        const textNode = createNodeFrom(token) as TextNode
        state.currentNode.children.push(textNode)
        state.caretPosition++
        return state
      },
    },
    {
      tokenType: TokenTypes.CloseTag,
      handler(token, state) {
        const closeTagName = parseCloseTagName(token.value)
        if (closeTagName !== state.currentNode.name) {
          state.errorHandler.addError({
            type: ParseErrorType.MismatchedTag,
            message: `Expected closing tag for "${state.currentNode.name ?? 'unknown'}" but found "${closeTagName}".`,
            range: cloneRange(token.range),
            loc: cloneLocation(token.loc),
            recovery: 'The mismatched closing tag was skipped.',
          })

          let ancestor = state.currentNode.parentRef
          let context = state.currentContext.parentRef?.parentRef

          while (ancestor && ancestor.type !== NodeTypes.Document) {
            if (ancestor.name === closeTagName) {
              let unclosedNode = state.currentNode

              while (unclosedNode && unclosedNode !== ancestor) {
                addUnclosedTagError(state, unclosedNode)
                unclosedNode = unclosedNode.parentRef
              }

              state.currentNode = ancestor
              state.currentContext = context
              return state
            }

            ancestor = ancestor.parentRef
            context = context?.parentRef?.parentRef
          }

          state.caretPosition++
          return state
        }
        state.currentContext = state.currentContext.parentRef
        return state
      },
    },
    {
      tokenType: TokenTypes.CommentOpen,
      handler(token, state) {
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
  ],
  (_, state) => {
    state.caretPosition++
    return state
  },
)

/**
 * Construct document or element children from content tokens.
 */
export function construct(
  token: AnyToken,
  state: ConstructTreeState<ContextualElementNode>,
) {
  return dispatch(token, state)
}
