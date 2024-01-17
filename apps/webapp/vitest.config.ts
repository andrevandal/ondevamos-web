import { defineVitestConfig } from 'nuxt-vitest/config'
import { configDefaults } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineVitestConfig({
  test: {
    coverage: {
      exclude: [
        ...Array.from(configDefaults.coverage.exclude ?? []),
        '.nuxt',
        'schemas/db',
      ],
    },
    exclude: [...configDefaults.exclude],
    include: ['**/**/**.test.ts'],
  },
  plugins: [tsconfigPaths()],
})
