import { transformerRenderWhitespace } from '@shikijs/transformers'
import { transformerTwoslash } from '@shikijs/vitepress-twoslash'
import { defineConfig } from 'vitepress'
import { groupIconMdPlugin } from 'vitepress-plugin-group-icons'
import { head } from './config/head'
import { getThemeConfig } from './config/theme'
import { appDescription, appTitle } from './meta'

export default defineConfig({
  title: appTitle,
  description: appDescription,
  lastUpdated: true,
  cleanUrls: true,
  ignoreDeadLinks: true,

  head,
  themeConfig: getThemeConfig(),
  markdown: {
    config(md) {
      md.use(groupIconMdPlugin)
    },

    codeTransformers: [
      transformerRenderWhitespace({
        position: 'all',
      }),
      transformerTwoslash({
        explicitTrigger: /\btwoslash\b/,
      }),
    ],
  },
})
