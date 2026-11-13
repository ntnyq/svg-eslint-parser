import { defineConfig } from 'tsdown'
import type { UserConfig } from 'tsdown'

const sharedConfig = {
  clean: true,
  entry: ['src/index.ts'],
  platform: 'neutral',
  deps: {
    neverBundle: ['eslint'],
  },
} satisfies UserConfig

// Build JavaScript and declarations separately so their namespace helpers do
// not become a shared runtime chunk.
export default defineConfig([
  {
    ...sharedConfig,
    dts: false,
    outputOptions: {
      codeSplitting: false,
    },
  },
  {
    ...sharedConfig,
    dts: {
      dtsOnly: true,
    },
  },
])
