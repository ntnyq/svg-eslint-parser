import { constructTree } from '../constructor'
import { tokenize } from '../tokenizer'
import type { Options, ParseResult } from '../types'
import { clearParent } from '../utils'

export function parse(source: string, _options: Options = {}): ParseResult {
  const { tokens } = tokenize(source)
  const { ast } = constructTree(tokens)

  return {
    ast: clearParent(ast),
    tokens,
  }
}
