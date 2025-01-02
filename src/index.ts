import { meta } from './meta'
import { ParseError, parseForESLint } from './parser'
import { visitorKeys } from './visitorKeys'
import type { Options } from './types'
import type * as AST from './types'

export const name = meta.name
export const VisitorKeys = visitorKeys

export function parse(code: string, options: Options = {}) {
  return parseForESLint(code, options).ast
}

export { meta }
export { ParseError }
export { parseForESLint }

export type { AST }

export * from './types'
export * from './constants'
