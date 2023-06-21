import { Kysely } from 'kysely'
import { PlanetScaleDialect } from 'kysely-planetscale'
import { fetch } from 'undici'
import type { RuntimeConfig } from 'nuxt/schema'
import { Database } from '../models/database'

const isMigrationEnv = process.env.NODE_ENV === 'migration'

const { databaseUrl } = (
  isMigrationEnv
    ? { databaseUrl: process.env.DATABASE_URL }
    : useRuntimeConfig()
) as RuntimeConfig

export const db = new Kysely<Database>({
  dialect: new PlanetScaleDialect({
    url: databaseUrl,
    fetch,
  }),
})
