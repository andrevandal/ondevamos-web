import {
  mysqlTable,
  bigint,
  varchar,
  text,
  timestamp,
  int,
  uniqueIndex,
  boolean,
  date,
  time,
} from 'drizzle-orm/mysql-core'

// Opening Hours table
export const openingHours = mysqlTable(
  'opening_hours',
  {
    id: bigint('id', { mode: 'number' }).autoincrement().primaryKey().notNull(),
    uuid: varchar('uuid', { length: 12 }).notNull(),
    placeId: bigint('place_id', { mode: 'number' }).notNull(),
    dayOfWeek: int('day_of_week').notNull(),
    openTime: time('open_time').notNull(),
    closeTime: time('close_time').notNull(),
    createdAt: timestamp('created_at', { mode: 'string' })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { mode: 'string' }),
    active: boolean('active').default(false),
  },
  (table) => {
    return {
      uuid: uniqueIndex('uuid').on(table.uuid),
    }
  },
)

// Special Opening Hours table
export const specialOpeningHours = mysqlTable(
  'special_opening_hours',
  {
    id: bigint('id', { mode: 'number' }).autoincrement().primaryKey().notNull(),
    uuid: varchar('uuid', { length: 12 }).notNull(),
    placeId: bigint('place_id', { mode: 'number' }).notNull(),
    description: text('description'),
    date: date('date').notNull(),
    openTime: time('open_time').notNull(),
    closeTime: time('close_time').notNull(),
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
