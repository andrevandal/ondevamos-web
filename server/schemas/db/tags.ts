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

import { placesToTags } from '@/server/schemas/db/places'

type Icon = {}

// Tag table
export const tags = mysqlTable(
  'tags',
  {
    id: bigint('id', { mode: 'number' }).autoincrement().primaryKey().notNull(),
    uuid: varchar('uuid', { length: 12 }).notNull(),
    slug: varchar('slug', { length: 100 }).notNull(),
    description: text('description'),
    icon: json('icon_name').$type<Icon>(),
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

export const tagsRelations = relations(tags, ({ many }) => ({
  placesToTags: many(placesToTags),
}))
