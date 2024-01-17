import type { Config } from 'drizzle-kit'
import * as dotenv from 'dotenv'
dotenv.config()

export default {
  schema: './schemas/db/index.ts',
  out: './migrations/',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL as string,
  },
} satisfies Config
