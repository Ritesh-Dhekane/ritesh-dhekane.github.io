import { defineConfig } from 'vitest/config'

// Tests cover the content layer only (plain TypeScript), so no React plugin is needed here.
export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
  },
})
