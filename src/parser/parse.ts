import { constructTree } from '../constructor'
import { tokenize } from '../tokenizer'
import { clearParent } from '../utils'
import type { Options, ParseResult } from '../types'

export function parse(source: string, _options: Options = {}): ParseResult {
  const { tokens } = tokenize(source)
  const { ast } = constructTree(tokens)

  return {
    ast: clearParent(ast),
    tokens,
  }
}
