# Guide

## Install

::: code-group

```shell [npm]
npm i svg-eslint-parser -D
```

```shell [yarn]
yarn add svg-eslint-parser -D
```

```shell [pnpm]
pnpm add svg-eslint-parser -D
```

:::

## Usage

### ESLint

```ts [eslint.config.mjs] twoslash
// @noErrors
import pluginSVG from 'eslint-plugin-svg'
import * as parserSVG from 'svg-eslint-parser'

/**
 * @type {import('eslint').Linter.Config[]}
 */
export default [
  // other configs
  {
    name: 'svg/rules',
    files: ['**/*.svg'],
    plugins: {
      svg: pluginSVG,
    },
    languageOptions: {
      parser: parserSVG,
    },
    rules: {
      // enable rules of eslint-plugin-svg
      'svg/no-empty-title': 'error',
    },
  },
]
```
