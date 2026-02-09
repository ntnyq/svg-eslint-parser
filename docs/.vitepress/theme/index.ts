import './app.css'
import '@shikijs/vitepress-twoslash/style.css'
import 'uno.css'
import 'virtual:group-icons.css'
import TwoSlash from '@shikijs/vitepress-twoslash/client'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import CustomLayout from './CustomLayout.vue'

export default {
  extends: DefaultTheme,
  Layout: () => h(CustomLayout),
  enhanceApp({ app }) {
    app.use(TwoSlash)
  },
} satisfies Theme
