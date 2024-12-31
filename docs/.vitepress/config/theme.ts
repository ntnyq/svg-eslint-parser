import { version } from '../../../package.json'
import { packageName } from '../meta'
import type { DefaultTheme } from 'vitepress'

const VERSIONS: DefaultTheme.NavItemWithLink[] = [
  { text: `v${version} (current)`, link: '/' },
  { text: `Release Notes`, link: `https://github.com/ntnyq/${packageName}/releases` },
]

export function getThemeConfig() {
  const config: DefaultTheme.Config = {
    search: {
      provider: 'local',
      options: {
        detailedView: true,
      },
    },

    // logo: {
    //   light: '/logo-light.svg',
    //   dark: '/logo-dark.svg',
    // },

    editLink: {
      text: 'Suggest changes to this page',
      pattern: `https://github.com/ntnyq/${packageName}/edit/main/docs/:path`,
    },

    socialLinks: [
      { icon: 'x', link: 'https://twitter.com/ntnyq' },
      { icon: 'npm', link: `https://www.npmjs.com/package/${packageName}` },
      { icon: 'github', link: `https://github.com/ntnyq/${packageName}` },
    ],

    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/' },
      { text: 'Playground', link: '/play/' },
      {
        text: `v${version}`,
        items: VERSIONS,
      },
    ],

    sidebar: {
      '/': [
        {
          text: 'Guide',
          items: [
            { text: 'Home', link: '/' },
            { text: 'Guide', link: '/guide/' },
          ],
        },
      ],
    },
  }

  return config
}
