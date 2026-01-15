import { NodeTypes, TokenTypes } from '../constants'
import { visitorKeys } from '../visitorKeys'
import { parse } from './parse'
import { traverse } from './traverse'
import type { Options, ParseForESLintResult, Program } from '../types'

export function parseForESLint(
  source: string,
  options: Options = {},
): ParseForESLintResult {
  const { ast, tokens } = parse(source, options)

  const comments: string[] = []

  const programNode: Program = {
    type: NodeTypes.Program,
    body: [ast],
    comments,
    tokens: tokens.filter(
      token =>
        token.type !== TokenTypes.CommentOpen
        && token.type !== TokenTypes.CommentClose
        && token.type !== TokenTypes.CommentContent,
    ),
    range: ast.range,
    loc: ast.loc,
  }

  traverse(programNode, node => {
    if (node.type === NodeTypes.Comment && 'content' in node) {
      comments.push((node as any).content)
    }
  })

  return {
    ast: programNode,
    visitorKeys,
    scopeManager: null,
    services: {
      isSVG: true,
    },
  }
}
