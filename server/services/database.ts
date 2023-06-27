import type { RuntimeConfig } from 'nuxt/schema'

import { drizzle } from 'drizzle-orm/planetscale-serverless'
import { connect } from '@planetscale/database'

const isMigrationEnv = process.env.NODE_ENV === 'migration'

const { databaseUrl } = (
  isMigrationEnv
    ? { databaseUrl: process.env.DATABASE_URL }
    : useRuntimeConfig()
) as RuntimeConfig

const connection = connect({
  url: databaseUrl,
})

export const db = drizzle(connection)

export default db
