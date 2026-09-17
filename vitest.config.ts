import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    fsModuleCache: true,
    watch: false,
    coverage: {
      include: ['src/**/*.ts'],
      reporter: ['text', 'html'],
    },
  },
})
