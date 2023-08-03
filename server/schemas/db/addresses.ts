import {
  mysqlTable,
  bigint,
  varchar,
  text,
  timestamp,
  double,
  uniqueIndex,
} from 'drizzle-orm/mysql-core'
// Addresses table
export const addresses = mysqlTable(
  'addresses',
  {
    id: bigint('id', { mode: 'number' }).autoincrement().primaryKey().notNull(),
    uuid: varchar('uuid', { length: 12 }).notNull(),
    street: text('street'),
    number: text('number'),
    complement: text('complement'),
    neighborhood: text('neighborhood'),
    cityId: bigint('city_id', { mode: 'number' }).notNull(),
    latitude: double('latitude'),
    longitude: double('longitude'),
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

// Cities table
export const cities = mysqlTable(
  'cities',
  {
    id: bigint('id', { mode: 'number' }).autoincrement().primaryKey().notNull(),
    uuid: varchar('uuid', { length: 12 }).notNull(),
    ibgeCode: varchar('ibge_code', { length: 7 }).notNull(),
    name: text('name').notNull(),
    state: text('state').notNull(),
    country: text('country').notNull(),
    latitude: double('latitude'),
    longitude: double('longitude'),
    createdAt: timestamp('created_at', { mode: 'string' })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { mode: 'string' }),
  },
  (table) => {
    return {
      uuid: uniqueIndex('uuid').on(table.uuid),
      ibgeCode: uniqueIndex('ibge_code').on(table.uuid),
    }
  },
)
