import 'dotenv/config'
import { consola } from 'consola'
import { migrate } from 'drizzle-orm/postgres-js/migrator'

import { db } from '@/services/database'

try {
  consola.info('Running migrations...')
  await migrate(db, { migrationsFolder: './migrations' })
  consola.success('Migrations ran successfully')
  process.exit(0)
} catch (e) {
  consola.log(e)
}
