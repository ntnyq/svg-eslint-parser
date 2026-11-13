import { NodeTypes } from '../ast/nodeTypes'
import { traverse } from '../ast/traverse'
import { visitorKeys } from '../ast/visitorKeys'
import { TokenTypes } from '../tokenizer/tokenTypes'
import { throwIfParseError } from './errorPolicy'
import { parseSource } from './parseSource'
import type { ESLintComment, Program } from '../ast/types'
import type { ParseForESLintResult } from '../eslint/types'
import type { Options } from './types'

/**
 * Parse SVG source into an ESLint-compatible parser result.
 * @param source - SVG source code
 * @param options - Parser options, including error recovery
 * @returns ESLint parser result with visitor keys, services, tokens, and comments
 */
export function parseForESLint(
  source: string,
  options: Options = {},
): ParseForESLintResult {
  const { ast, errors, tokens, warnings } = parseSource(source)
  throwIfParseError(errors, options)

  const programNode: Program = {
    type: NodeTypes.Program,
    body: [],
    comments: [],
    document: ast,
    tokens: tokens.filter(
      token =>
        ![
          TokenTypes.CommentOpen,
          TokenTypes.CommentClose,
          TokenTypes.CommentContent,
        ].includes(token.type),
    ),
    range: ast.range,
    loc: ast.loc,
  }

  const comments: ESLintComment[] = []

  traverse(ast, node => {
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
