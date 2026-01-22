// @ts-check

import { defineESLintConfig } from '@ntnyq/eslint-config'

export default defineESLintConfig({
  svgo: true,
  unocss: true,
  vue: {
    overrides: {
      'vue/no-literals-in-template': 'off',
    },
  },
})
