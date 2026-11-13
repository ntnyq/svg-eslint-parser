import { NodeTypes } from '../../ast/nodeTypes'
import { ParseErrorType } from '../../diagnostics/types'
import { cloneLocation } from '../../source/cloneLocation'
import { cloneRange } from '../../source/cloneRange'
import { parseCloseTagName } from '../../syntax/parseCloseTagName'
import { parseProcessingInstruction } from '../../syntax/parseProcessingInstruction'
import { TokenTypes } from '../../tokenizer/tokenTypes'
import { ConstructTreeContextTypes } from '../constructTreeContextTypes'
import { createNodeFrom } from '../createNodeFrom'
import { initChildrenIfNone } from '../initIfNone'
import { createTokenDispatcher } from '../tokenDispatcher'
import {
  consume,
  createContext,
  getParentContext,
  reprocess,
} from '../transitions'
import type { ProcessingInstructionNode, TextNode } from '../../ast/types'
import type { AnyToken } from '../../tokenizer/token'
import type {
  ConstructTreeContext,
  ConstructTreeState,
} from '../constructTreeState'
import type {
  ContextualCDATANode,
  ContextualCommentNode,
  ContextualDoctypeNode,
  ContextualElementNode,
  ContextualXMLDeclarationNode,
} from '../contextualNode'

function addUnclosedTagError(
  state: ConstructTreeState,
  node: ContextualElementNode,
  closeToken: AnyToken,
) {
  node.range[1] = closeToken.range[0]
  node.loc.end = { ...closeToken.loc.start }
  state.errorHandler.addError({
    type: ParseErrorType.UnclosedTag,
    message: `Unclosed tag "${node.name ?? 'unknown'}".`,
    range: cloneRange(node.range),
    loc: cloneLocation(node.loc),
    recovery: 'The parser kept the partial element in the AST.',
  })
}

const dispatchToken = createTokenDispatcher(
  ConstructTreeContextTypes.TagContent,
  [
    {
      tokenType: TokenTypes.ProcessingInstruction,
      handler(token, state) {
        initChildrenIfNone(state.currentContext.node)
        const { target, value } = parseProcessingInstruction(token.value)
        const instructionNode: ProcessingInstructionNode = {
          type: NodeTypes.ProcessingInstruction,
          target,
          value,
          range: cloneRange(token.range),
          loc: cloneLocation(token.loc),
        }
        state.currentContext.node.children.push(instructionNode)
        return consume(state)
      },
    },
    {
      tokenType: TokenTypes.CDATAOpen,
      handler(token, state) {
        initChildrenIfNone(state.currentContext.node)
        const cdataNode: ContextualCDATANode = {
          type: NodeTypes.CDATA,
          value: '',
          range: cloneRange(token.range),
          loc: cloneLocation(token.loc),
        }
        state.currentContext.node.children.push(cdataNode)
        return reprocess(
          state,
          createContext(
            ConstructTreeContextTypes.CDATA,
            cdataNode,
            state.currentContext,
          ),
        )
      },
    },
    {
      tokenType: TokenTypes.XMLDeclarationOpen,
      handler(token, state) {
        if (state.currentContext.node.type !== NodeTypes.Document) {
          return consume(state)
        }
        initChildrenIfNone(state.currentContext.node)
        const declarationNode: ContextualXMLDeclarationNode = {
          type: NodeTypes.XMLDeclaration,
          range: cloneRange(token.range),
          loc: cloneLocation(token.loc),
          attributes: [],
        }
        state.currentContext.node.children.push(declarationNode)
        return reprocess(
          state,
          createContext(
            ConstructTreeContextTypes.XMLDeclaration,
            declarationNode,
            state.currentContext,
          ),
        )
      },
    },
    {
      tokenType: TokenTypes.OpenTagStart,
      handler(token, state) {
        initChildrenIfNone(state.currentContext.node)
        const elementNode: ContextualElementNode = {
          type: NodeTypes.Element,
          name: '',
          selfClosing: false,
          range: cloneRange(token.range),
          loc: cloneLocation(token.loc),
          attributes: [],
          children: [],
        }
        state.currentContext.node.children.push(elementNode)
        return reprocess(
          state,
          createContext(
            ConstructTreeContextTypes.Tag,
            elementNode,
            state.currentContext,
          ),
        )
      },
    },
    {
      tokenType: TokenTypes.DoctypeOpen,
      handler(token, state) {
        if (state.currentContext.node.type !== NodeTypes.Document) {
          return consume(state)
        }
        initChildrenIfNone(state.currentContext.node)
        const doctypeNode: ContextualDoctypeNode = {
          type: NodeTypes.Doctype,
          range: cloneRange(token.range),
          loc: cloneLocation(token.loc),
          attributes: [],
        }
        state.currentContext.node.children.push(doctypeNode)
        return reprocess(
          state,
          createContext(
            ConstructTreeContextTypes.Doctype,
            doctypeNode,
            state.currentContext,
          ),
        )
      },
    },
    {
      tokenType: TokenTypes.Text,
      handler(token, state) {
        initChildrenIfNone(state.currentContext.node)
        const textNode: TextNode = {
          ...createNodeFrom(token),
          type: NodeTypes.Text,
        }
        state.currentContext.node.children.push(textNode)
        return consume(state)
      },
    },
    {
      tokenType: TokenTypes.CloseTag,
      handler(token, state) {
        const node = state.currentContext.node
        const closeTagName = parseCloseTagName(token.value)
        if (node.type === NodeTypes.Element && closeTagName === node.name) {
          return reprocess(state, getParentContext(state))
        }
        state.errorHandler.addError({
          type: ParseErrorType.MismatchedTag,
          message: `Expected closing tag for "${node.type === NodeTypes.Element ? (node.name ?? 'unknown') : 'unknown'}" but found "${closeTagName}".`,
          range: cloneRange(token.range),
          loc: cloneLocation(token.loc),
          recovery: 'The mismatched closing tag was skipped.',
        })
        // Each Tag frame owns one open element. Context frames restore both
        // the ancestor element and its parsing context in a single transition.
        let ancestor = state.currentContext.parentRef?.parentRef
        while (ancestor) {
          if (
            ancestor.type === ConstructTreeContextTypes.Tag &&
            ancestor.node.name === closeTagName
          ) {
            let unclosed: ConstructTreeContext | undefined =
              state.currentContext
            while (unclosed && unclosed !== ancestor) {
              if (unclosed.type === ConstructTreeContextTypes.Tag) {
                addUnclosedTagError(state, unclosed.node, token)
              }
              unclosed = unclosed.parentRef
            }
            return reprocess(state, ancestor)
          }
          ancestor = ancestor.parentRef
        }
        return consume(state)
      },
    },
    {
      tokenType: TokenTypes.CommentOpen,
      handler(token, state) {
        initChildrenIfNone(state.currentContext.node)
        const commentNode: ContextualCommentNode = {
          type: NodeTypes.Comment,
          content: '',
          value: '',
          range: cloneRange(token.range),
          loc: cloneLocation(token.loc),
        }
        state.currentContext.node.children.push(commentNode)
        return reprocess(
          state,
          createContext(
            ConstructTreeContextTypes.Comment,
            commentNode,
            state.currentContext,
          ),
        )
      },
    },
  ],
  (_, state) => {
    return consume(state)
  },
)

/**
 * Construct document or element children from content tokens.
 */
export const construct = dispatchToken
