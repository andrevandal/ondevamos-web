import {
  mysqlTable,
  bigint,
  varchar,
  text,
  timestamp,
  uniqueIndex,
  boolean,
} from 'drizzle-orm/mysql-core'
import { relations } from 'drizzle-orm'
import { places } from '@/server/schemas/db/places'
// Actions table
export const actions = mysqlTable(
  'actions',
  {
    id: bigint('id', { mode: 'number' }).autoincrement().primaryKey().notNull(),
    uuid: varchar('uuid', { length: 12 }).notNull(),
    placeId: bigint('place_id', { mode: 'number' }).notNull(),
    title: text('title'),
    link: text('link'),
    iconName: text('icon_name'),
    active: boolean('active').default(false),
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
export const actionsRelations = relations(actions, ({ one }) => ({
  place: one(places, {
    fields: [actions.placeId],
    references: [places.id],
  }),
}))
