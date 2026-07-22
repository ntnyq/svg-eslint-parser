import type { Rule, SourceCode } from 'eslint'
import type { NodeTypes } from '../constants'
import type { AnyNode, AnyToken, Program } from './ast'
import type { SVGParserServices } from './parse'

/**
 * Raw parser node lookup keyed by each AST `type` value.
 */
export type SVGNodeMap = {
  [Node in AnyNode as Node['type']]: Node
}

/**
 * ESLint listener nodes, including the parent link added during traversal.
 */
export type SVGRuleNodeMap = {
  [Type in keyof SVGNodeMap]: SVGNodeMap[Type] extends Program
    ? SVGNodeMap[Type] & { parent: null }
    : SVGNodeMap[Type] & {
        parent: SVGRuleNodeMap[keyof SVGNodeMap]
      }
}

type SVGRuleEntryListener = {
  [Type in keyof SVGRuleNodeMap]?: (node: SVGRuleNodeMap[Type]) => void
}

type SVGRuleExitListener = {
  [Type in keyof SVGRuleNodeMap as `${string & Type}:exit`]?: (
    node: SVGRuleNodeMap[Type],
  ) => void
}

/**
 * Type-safe ESLint listener map for every SVG AST node and exit event.
 */
export type SVGRuleListener = SVGRuleEntryListener & SVGRuleExitListener

/**
 * ESLint SourceCode specialized with this parser's AST, tokens, and services.
 */
export interface SVGSourceCode extends Omit<
  SourceCode,
  'ast' | 'getText' | 'getTokens' | 'parserServices'
> {
  ast: Program
  parserServices: SVGParserServices

  getText(node?: AnyNode, beforeCount?: number, afterCount?: number): string
  getTokens(
    node: AnyNode,
    beforeCount?: number,
    afterCount?: number,
  ): AnyToken[]
}

/**
 * ESLint rule context specialized for SVG rules.
 */
export interface SVGRuleContext<
  Options extends unknown[] = [],
  MessageIds extends string = string,
> extends Omit<Rule.RuleContext, 'options' | 'report' | 'sourceCode'> {
  options: Options
  sourceCode: SVGSourceCode

  report(
    descriptor: Omit<Rule.ReportDescriptor, 'messageId' | 'node'> & {
      node: AnyNode
      messageId?: MessageIds
    },
  ): void
}

type SVGRuleMetaData<MessageIds extends string> = Omit<
  NonNullable<Rule.RuleModule['meta']>,
  'messages'
> & {
  messages?: Record<MessageIds, string>
}

/**
 * ESLint rule module with contextual SVG node, option, and message-ID types.
 */
export type SVGRuleModule<
  Options extends unknown[] = [],
  MessageIds extends string = string,
> = Omit<Rule.RuleModule, 'create' | 'meta'> & {
  meta?: SVGRuleMetaData<MessageIds>
  create(context: SVGRuleContext<Options, MessageIds>): SVGRuleListener
}

/** All node-type strings accepted by typed SVG listeners. */
export type SVGRuleNodeType = NodeTypes & keyof SVGRuleNodeMap
