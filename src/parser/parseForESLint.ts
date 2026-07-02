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

/**
 * Parse SVG source into an ESLint-compatible parser result.
 * @param source - SVG source code
 * @param options - Parser options forwarded to the base parser
 * @returns ESLint parser result with visitor keys, services, tokens, and comments
 */
export function parseForESLint(
  source: string,
  options: Options = {},
): ParseForESLintResult {
  const { ast, errors, tokens, warnings } = parse(source, options)
  const programNode: Program = {
    type: NodeTypes.Program,
    body: [],
    comments: [],
    document: ast,
    tokens: tokens.filter(
      token =>
        token.type !== TokenTypes.CommentOpen &&
        token.type !== TokenTypes.CommentClose &&
        token.type !== TokenTypes.CommentContent,
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
      errors,
      isSVG: true,
      warnings,
    },
  }
}
