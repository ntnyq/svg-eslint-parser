import { defineConfig, presetIcons, presetUno, transformerDirectives } from 'unocss'

export default defineConfig({
  transformers: [transformerDirectives()],

  presets: [
    presetUno(),
    presetIcons({
      autoInstall: true,
      extraProperties: {},
      scale: 1.2,
    }),
  ],

  shortcuts: [
    {
      'flex-center': 'flex justify-center items-center',
      'wh-full': 'w-full h-full',
    },
  ],
})
