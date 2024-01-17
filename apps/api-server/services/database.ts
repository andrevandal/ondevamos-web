import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import * as schema from '@/schemas/db'

const isMigrationEnv = process.env.NODE_ENV === 'migration'

const { databaseUrl } = isMigrationEnv
  ? { databaseUrl: process.env.DATABASE_URL }
  : useRuntimeConfig()

const queryClient = postgres(databaseUrl, isMigrationEnv ? {} : { max: 1 })

export const db = drizzle(queryClient, { schema })

export default db
