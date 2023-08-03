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
import { relations } from 'drizzle-orm'
import { placesToCategories } from '@/server/schemas/db/places'

type Icon = {}

// Categories table
export const categories = mysqlTable(
  'categories',
  {
    id: bigint('id', { mode: 'number' }).autoincrement().primaryKey().notNull(),
    uuid: varchar('uuid', { length: 12 }).notNull(),
    name: text('name').notNull(),
    slug: varchar('slug', { length: 100 }).notNull(),
    description: text('description'),
    icon: json('icon').$type<Icon>(),
    active: boolean('active').default(false),
    createdAt: timestamp('created_at', { mode: 'string' })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { mode: 'string' }),
  },
  (table) => {
    return {
      uuid: uniqueIndex('uuid').on(table.uuid),
      slug: uniqueIndex('slug').on(table.slug),
    }
  },
)

export const categoriesRelations = relations(categories, ({ many }) => ({
  placesToCategories: many(placesToCategories),
}))
