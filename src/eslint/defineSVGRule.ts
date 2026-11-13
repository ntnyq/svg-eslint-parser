import type { Rule } from 'eslint'
import type { SVGRuleModule } from './types'

/**
 * Define a type-safe SVG rule while retaining compatibility with ESLint plugin
 * rule collections.
 */
export function defineSVGRule<
  Options extends unknown[] = [],
  MessageIds extends string = string,
>(
  rule: SVGRuleModule<Options, MessageIds>,
): SVGRuleModule<Options, MessageIds> & Rule.RuleModule {
  return rule as SVGRuleModule<Options, MessageIds> & Rule.RuleModule
}
