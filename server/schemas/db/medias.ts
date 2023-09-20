import {
  mysqlTable,
  bigint,
  varchar,
  text,
  timestamp,
  uniqueIndex,
  boolean,
  json,
  mysqlEnum,
} from 'drizzle-orm/mysql-core'

type externalMetadata = Partial<{}>

// Medias table
export const medias = mysqlTable(
  'medias',
  {
    id: bigint('id', { mode: 'number' }).autoincrement().primaryKey().notNull(),
    uuid: varchar('uuid', { length: 12 }).notNull(),
    type: mysqlEnum('type', ['image', 'video']).notNull(),
    title: text('title'),
    description: text('description'),
    alternativeText: text('alternative_text'),
    url: text('url').notNull(),
    active: boolean('active').default(false),
    status: mysqlEnum('status', ['pending', 'completed', 'error']).default(
      'pending',
    ),
    createdAt: timestamp('created_at', { mode: 'string' })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { mode: 'string' }),
    externalMetadata: json('external_metadata').$type<externalMetadata>(),
  },
  (table) => {
    return {
      uuid: uniqueIndex('uuid').on(table.uuid),
    }
  },
)
