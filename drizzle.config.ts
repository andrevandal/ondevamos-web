import type { Config } from 'drizzle-kit'
import * as dotenv from 'dotenv'
dotenv.config()

export default {
  schema: './server/schemas/db/**/*.ts',
  out: './server/migrations/',
  driver: 'mysql2',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL as string,
  },
} satisfies Config
