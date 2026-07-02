// @ts-check

import { defineESLintConfig } from '@ntnyq/eslint-config'

export default defineESLintConfig({
  oxfmt: true,
  prettier: false,
  unicorn: {
    overrides: {
      'unicorn/better-dom-traversing': 'off',
    },
  },
})
