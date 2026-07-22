import { Linter } from 'eslint'
import { describe, expect, it } from 'vitest'
import * as parser from '../src'
import { defineSVGRule, NodeTypes } from '../src'
import type { SVGParserServices, SVGRuleNodeMap } from '../src'

const observations = {
  exitedElementNames: [] as string[],
  parentName: '',
  programVisited: false,
  servicesAreSVG: false,
  sourceText: '',
  tokenCount: 0,
}

function resetObservations(): void {
  observations.exitedElementNames = []
  observations.parentName = ''
  observations.programVisited = false
  observations.servicesAreSVG = false
  observations.sourceText = ''
  observations.tokenCount = 0
}

const requireCircleRadius = defineSVGRule<[], 'missingRadius'>({
  meta: {
    type: 'problem',
    docs: {
      description: 'Require a radius on circle elements.',
    },
    schema: [],
    messages: {
      missingRadius: 'Circle elements require an r attribute.',
    },
  },
  create(context) {
    return {
      Program(node) {
        observations.programVisited = node.document.type === NodeTypes.Document
      },
      Element(node) {
        const services: SVGParserServices = context.sourceCode.parserServices

        observations.servicesAreSVG = services.isSVG

        if (node.name === '__compile_only__') {
          // @ts-expect-error Invalid message IDs are rejected by SVGRuleContext.
          context.report({ node, messageId: 'unknownMessage' })
        }

        if (node.name !== 'circle') {
          return
        }

        const parent: SVGRuleNodeMap[keyof SVGRuleNodeMap] = node.parent

        if (parent.type === NodeTypes.Element) {
          observations.parentName = parent.name
        }
        observations.sourceText = context.sourceCode.getText(node)
        observations.tokenCount = context.sourceCode.getTokens(node).length

        if (!node.attributes.some(attribute => attribute.key.value === 'r')) {
          context.report({
            node,
            messageId: 'missingRadius',
          })
        }
      },
      'Element:exit': function (node) {
        observations.exitedElementNames.push(node.name)
      },
    }
  },
})

const config: Linter.Config = {
  files: ['**/*.svg'],
  languageOptions: {
    parser,
  },
  plugins: {
    test: {
      rules: {
        'require-circle-radius': requireCircleRadius,
      },
    },
  },
  rules: {
    'test/require-circle-radius': 'error',
  },
}

describe('ESLint integration', () => {
  it('runs a typed SVG rule through Linter', () => {
    resetObservations()
    const linter = new Linter({ configType: 'flat' })
    const source = `<svg xmlns="http://www.w3.org/2000/svg">
  <circle />
</svg>`
    const messages = linter.verify(source, config, 'icon.svg')

    expect(messages).toEqual([
      expect.objectContaining({
        ruleId: 'test/require-circle-radius',
        message: 'Circle elements require an r attribute.',
        line: 2,
        column: 3,
      }),
    ])
    expect(observations).toMatchObject({
      parentName: 'svg',
      programVisited: true,
      servicesAreSVG: true,
      sourceText: '<circle />',
    })
    expect(observations.tokenCount).toBeGreaterThan(0)
    expect(observations.exitedElementNames).toStrictEqual(['circle', 'svg'])
  })

  it('returns a fatal parsing message for malformed SVG', () => {
    const linter = new Linter({ configType: 'flat' })
    const messages = linter.verify('<svg><g></svg>', config, 'broken.svg')

    expect(messages).toEqual([
      expect.objectContaining({
        ruleId: null,
        fatal: true,
        message: expect.stringContaining('Expected closing tag for "g"'),
        line: 1,
        column: 9,
      }),
    ])
  })
})
