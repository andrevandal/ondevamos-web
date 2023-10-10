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
} from 'drizzle-orm/mysql-core'
import { sql } from 'drizzle-orm'

// Opening Hours table
export const openingHours = mysqlTable(
  'opening_hours',
  {
    id: bigint('id', { mode: 'number' }).autoincrement().primaryKey().notNull(),
    uuid: varchar('uuid', { length: 12 }).notNull(),
    placeId: bigint('place_id', { mode: 'number' }).notNull(),
    dayOfWeek: int('day_of_week').notNull(),
    openTime1: int('open_time1').notNull(),
    closeTime1: int('close_time1').notNull(),
    openTime2: int('open_time2'),
    closeTime2: int('close_time2'),
    active: boolean('active').default(false),
    isOpen24Hours: boolean('is_open_24_hours').default(false),
    isClosed: boolean('is_closed').default(false),
    createdAt: timestamp('created_at', { mode: 'string' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp('updated_at', { mode: 'string' }),
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
    startDate: date('start_date', { mode: 'string' }).notNull(),
    endDate: date('end_date', { mode: 'string' }).notNull(),
    openTime1: int('open_time1').notNull(),
    closeTime1: int('close_time1').notNull(),
    openTime2: int('open_time2'),
    closeTime2: int('close_time2'),
    isOpen24Hours: boolean('is_open_24_hours').default(false),
    isClosed: boolean('is_closed').default(false),
    createdAt: timestamp('created_at', { mode: 'string' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp('updated_at', { mode: 'string' }),
  },
  (table) => {
    return {
      uuid: uniqueIndex('uuid').on(table.uuid),
    }
  },
)
