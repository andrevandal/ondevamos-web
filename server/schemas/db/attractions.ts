import {
  mysqlTable,
  bigint,
  varchar,
  text,
  timestamp,
  int,
  uniqueIndex,
} from 'drizzle-orm/mysql-core'
import { relations } from 'drizzle-orm'
import { places } from '@/server/schemas/db/places'
// Attractions table
export const attractions = mysqlTable(
  'attractions',
  {
    id: bigint('id', { mode: 'number' }).autoincrement().primaryKey().notNull(),
    uuid: varchar('uuid', { length: 12 }).notNull(),
    placeId: bigint('place_id', { mode: 'number' }).notNull(),
    title: text('title').notNull(),
    description: text('description'),
    mediaId: bigint('media_id', { mode: 'number' }),
    isFeatured: int('is_featured').notNull(),
    createdAt: timestamp('created_at', { mode: 'string' })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { mode: 'string' }),
  },
  (table) => {
    return {
      uuid: uniqueIndex('uuid').on(table.uuid),
    }
  },
)

export const attractionsRelations = relations(attractions, ({ one }) => ({
  place: one(places, {
    fields: [attractions.placeId],
    references: [places.id],
  }),
}))
