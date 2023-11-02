import {
  mysqlTable,
  bigint,
  varchar,
  text,
  timestamp,
  double,
  int,
  uniqueIndex,
  boolean,
  primaryKey,
  json,
} from 'drizzle-orm/mysql-core'
import { sql } from 'drizzle-orm'

type externalMetadata = Partial<{}>

type PlaceIcon = {
  name: string
  className?: string
}

type PlaceAction = Partial<{
  type: string
  name: string
  link?: string
  icon?: PlaceIcon
}>

type PlaceAddress = Partial<{
  street: string
  number: string
  complement: string
  neighborhood: string
  zipCode: string
  latitude: number
  longitude: number
}>

type CitiesExternalMetadata = Partial<{}>

export const cities = mysqlTable(
  'cities',
  {
    id: bigint('id', { mode: 'number' }).autoincrement().primaryKey().notNull(),
    uuid: varchar('uuid', { length: 12 }).notNull(),
    ibgeCode: varchar('ibge_code', { length: 7 }).notNull(),
    name: text('name').notNull(),
    state: text('state').notNull(),
    country: text('country').notNull(),
    label: text('label').notNull(),
    createdAt: timestamp('created_at', { mode: 'string' })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { mode: 'string' }),
    externalMetadata: json('external_metadata').$type<CitiesExternalMetadata>(),
  },
  (table) => {
    return {
      uuid: uniqueIndex('uuid').on(table.uuid),
      ibgeCode: uniqueIndex('ibge_code').on(table.ibgeCode),
    }
  },
)

// Places table
export const places = mysqlTable(
  'places',
  {
    id: bigint('id', { mode: 'number' }).autoincrement().primaryKey().notNull(),
    uuid: varchar('uuid', { length: 12 }).notNull(),
    name: text('name').notNull(),
    slug: varchar('slug', { length: 100 }).unique('place_slug').notNull(),
    description: text('description'),
    ratingLevel: double('rating_level'),
    ratingCount: int('rating_count'),
    pricingLevel: int('pricing_level'),
    pricingCount: int('pricing_count'),
    address: json('address').$type<PlaceAddress>(),
    actions: json('actions').$type<PlaceAction[]>(),
    featuredMedias: json('featured_medias').$type<string[]>(),
    coverMedia: varchar('cover_media_id', { length: 12 }),
    avatarMedia: varchar('avatar_media_id', { length: 12 }),
    city: bigint('city_id', { mode: 'number' }).notNull(),
    externalId: varchar('external_id', { length: 128 }),
    active: boolean('active').default(false),
    createdAt: timestamp('created_at', { mode: 'string' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp('updated_at', { mode: 'string' }),
    externalMetadata: json('external_metadata').$type<externalMetadata>(),
  },
  (table) => {
    return {
      uuid: uniqueIndex('uuid').on(table.uuid),
      slug: uniqueIndex('slug').on(table.slug),
    }
  },
)

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
    featured: boolean('featured').notNull(),
    active: boolean('active').default(false),
    order: int('order').notNull().default(0),
    createdAt: timestamp('created_at', { mode: 'string' })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { mode: 'string' }),
  },
  (table) => ({
    uuid: uniqueIndex('uuid').on(table.uuid),
  }),
)

export const placesToTags = mysqlTable(
  'places_to_tags',
  {
    tagId: bigint('tag_id', { mode: 'number' }).notNull(),
    placeId: bigint('place_id', { mode: 'number' }).notNull(),
  },
  (t) => ({
    pk: primaryKey(t.tagId, t.placeId),
  }),
)

export const placesToCategories = mysqlTable(
  'places_to_categories',
  {
    categoryId: bigint('category_id', { mode: 'number' }).notNull(),
    placeId: bigint('place_id', { mode: 'number' }).notNull(),
  },
  (t) => ({
    pk: primaryKey(t.categoryId, t.placeId),
  }),
)