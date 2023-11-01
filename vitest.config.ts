import { defineVitestConfig } from 'nuxt-vitest/config'
import { configDefaults } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineVitestConfig({
  test: {
    coverage: {
      exclude: [
        ...Array.from(configDefaults.coverage.exclude ?? []),
        '.nuxt',
        'server/schemas/db',
      ],
    },
    exclude: [...configDefaults.exclude],
    include: ['server/utils/helpers.ts', 'server/**/**/**.test.ts'],
  },
  plugins: [tsconfigPaths()],
})
