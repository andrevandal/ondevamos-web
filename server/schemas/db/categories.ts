import {
  mysqlTable,
  bigint,
  varchar,
  text,
  timestamp,
  uniqueIndex,
  boolean,
  json,
} from 'drizzle-orm/mysql-core'
import { sql } from 'drizzle-orm'

type Icon = {
  name: string
  className?: string
}

// Categories table
export const categories = mysqlTable(
  'categories',
  {
    id: bigint('id', { mode: 'number' }).autoincrement().primaryKey().notNull(),
    uuid: varchar('uuid', { length: 12 }).notNull(),
    slug: varchar('slug', { length: 100 }).notNull(),
    name: varchar('name', { length: 100 }).notNull(),
    label: varchar('label', { length: 100 }).notNull(),
    description: text('description'),
    icon: json('icon').$type<Icon>(),
    active: boolean('active').default(false),
    createdAt: timestamp('created_at', { mode: 'string' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp('updated_at', { mode: 'string' }),
  },
  (table) => ({
    uuid: uniqueIndex('uuid').on(table.uuid),
    slug: uniqueIndex('slug').on(table.slug),
  }),
)
