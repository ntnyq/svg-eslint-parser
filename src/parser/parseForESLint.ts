import { NodeTypes, TokenTypes } from '../constants'
import { visitorKeys } from '../visitorKeys'
import { parse } from './parse'
import { traverse } from './traverse'
import type {
  ESLintComment,
  Options,
  ParseForESLintResult,
  Program,
} from '../types'

export function parseForESLint(
  source: string,
  options: Options = {},
): ParseForESLintResult {
  const { ast, tokens } = parse(source, options)
  const programNode: Program = {
    type: NodeTypes.Program,
    body: [ast],
    comments: [],
    tokens: tokens.filter(
      token =>
        token.type !== TokenTypes.CommentOpen
        && token.type !== TokenTypes.CommentClose
        && token.type !== TokenTypes.CommentContent,
    ),
    range: ast.range,
    loc: ast.loc,
  }

  const comments: ESLintComment[] = []

  traverse(programNode, node => {
    if (node.type === NodeTypes.Comment) {
      comments.push({
        type: 'Block',
        value: node.content,
        range: node.range,
        loc: node.loc,
      })
    }
  })

  programNode.comments = comments

  return {
    ast: programNode,
    visitorKeys,
    scopeManager: null,
    services: {
      isSVG: true,
    },
  }
}
