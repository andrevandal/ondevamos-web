import 'dotenv/config'

import { migrate } from 'drizzle-orm/planetscale-serverless/migrator'
import { db } from './services/database'

// this will automatically run needed migrations on the database
try {
  await migrate(db, { migrationsFolder: './server/migrations' })
} catch (e) {
  console.log(e)
}
