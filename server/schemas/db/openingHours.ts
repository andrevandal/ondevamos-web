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

// Opening Hours table
export const openingHours = mysqlTable(
  'opening_hours',
  {
    id: bigint('id', { mode: 'number' }).autoincrement().primaryKey().notNull(),
    uuid: varchar('uuid', { length: 12 }).notNull(),
    placeId: bigint('place_id', { mode: 'number' }).notNull(),
    dayOfWeek: int('day_of_week').notNull(),
    openTime: text('open_time').notNull(),
    closeTime: text('close_time').notNull(),
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

export const openingHoursRelations = relations(openingHours, ({ one }) => ({
  place: one(places, {
    fields: [openingHours.placeId],
    references: [places.id],
  }),
}))

// Special Opening Hours table
export const specialOpeningHours = mysqlTable(
  'special_opening_hours',
  {
    id: bigint('id', { mode: 'number' }).autoincrement().primaryKey().notNull(),
    uuid: varchar('uuid', { length: 12 }).notNull(),
    placeId: bigint('place_id', { mode: 'number' }).notNull(),
    description: text('description'),
    date: text('date').notNull(),
    openTime: text('open_time').notNull(),
    closeTime: text('close_time').notNull(),
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
export const specialOpeningHoursRelations = relations(
  specialOpeningHours,
  ({ one }) => ({
    place: one(places, {
      fields: [specialOpeningHours.placeId],
      references: [places.id],
    }),
  }),
)
