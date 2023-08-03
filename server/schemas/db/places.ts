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

import { relations } from 'drizzle-orm'

import { medias } from '@/server/schemas/db/medias'
import { actions } from '@/server/schemas/db/actions'
import { attractions } from '@/server/schemas/db/attractions'
import { categories } from '@/server/schemas/db/categories'
import { addresses } from '@/server/schemas/db/addresses'
import { tags } from '@/server/schemas/db/tags'
import {
  openingHours,
  specialOpeningHours,
} from '@/server/schemas/db/openingHours'

type externalMetadata = Partial<{}>

// Places table
export const places = mysqlTable(
  'places',
  {
    id: bigint('id', { mode: 'number' }).autoincrement().primaryKey().notNull(),
    uuid: varchar('uuid', { length: 12 }).notNull(),
    name: text('name').notNull(),
    slug: varchar('slug', { length: 100 }).notNull(),
    description: text('description'),
    ratingLevel: double('rating_level'),
    ratingCount: int('rating_count'),
    pricingLevel: int('pricing_level'),
    pricingLevelCount: int('pricing_level_count'),
    coverMediaId: bigint('cover_media_id', { mode: 'number' }),
    avatarMediaId: bigint('avatar_media_id', { mode: 'number' }),
    addressId: bigint('address_id', { mode: 'number' }).notNull(),
    openingHourId: bigint('opening_hour_id', { mode: 'number' }),
    externalId: bigint('external_id', { mode: 'number' }),
    active: boolean('active').default(false),
    createdAt: timestamp('created_at', { mode: 'string' })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { mode: 'string' }),
    externalMetadata: json('external_metadata').$type<externalMetadata>(),
  },
  (table) => {
    return {
      uuid: uniqueIndex('uuid').on(table.uuid),
      slug: uniqueIndex('slug').on(table.slug),
      externalId: uniqueIndex('external_id').on(table.externalId),
    }
  },
)

// Place relations
export const placesRelations = relations(places, ({ one, many }) => ({
  coverMedia: one(medias, {
    fields: [places.coverMediaId],
    references: [medias.id],
  }),
  avatarMedia: one(medias, {
    fields: [places.avatarMediaId],
    references: [medias.id],
  }),
  address: one(addresses, {
    fields: [places.addressId],
    references: [addresses.id],
  }),
  openingHours: one(openingHours, {
    fields: [places.openingHourId],
    references: [openingHours.id],
  }),
  attractions: many(attractions),
  actions: many(actions),
  placesToCategories: many(placesToCategories),
  placesToTags: many(placesToTags),
  placesToMedias: many(placesToMedias),
  placesToAddresses: many(placesToAddresses),
  specialOpeningHour: many(specialOpeningHours),
  openingHour: many(openingHours),
}))

// PlacesToCategories table (Many-to-Many Mapping)
export const placesToCategories = mysqlTable(
  'places_to_categories',
  {
    placeId: bigint('place_id', { mode: 'number' }).notNull(),
    categoryId: bigint('category_id', { mode: 'number' }).notNull(),
  },
  (table) => {
    return {
      pk: primaryKey(table.placeId, table.categoryId),
    }
  },
)
export const placesToCategoriesRelations = relations(
  placesToCategories,
  ({ one }) => ({
    category: one(categories, {
      fields: [placesToCategories.categoryId],
      references: [categories.id],
    }),
    place: one(places, {
      fields: [placesToCategories.placeId],
      references: [places.id],
    }),
  }),
)

// PlacesToTags table (Many-to-Many Mapping)
export const placesToTags = mysqlTable(
  'places_to_tags',
  {
    placeId: bigint('place_id', { mode: 'number' }).notNull(),
    tagId: bigint('tag_id', { mode: 'number' }).notNull(),
  },
  (table) => {
    return {
      pk: primaryKey(table.placeId, table.tagId),
    }
  },
)
export const placesToTagsRelations = relations(placesToTags, ({ one }) => ({
  tag: one(tags, {
    fields: [placesToTags.tagId],
    references: [tags.id],
  }),
  place: one(places, {
    fields: [placesToTags.placeId],
    references: [places.id],
  }),
}))

// PlacesToMedias table (Many-to-Many Mapping)
export const placesToMedias = mysqlTable(
  'places_to_medias',
  {
    mediaId: bigint('media_id', { mode: 'number' }).notNull(),
    placeId: bigint('place_id', { mode: 'number' }).notNull(),
  },
  (table) => {
    return {
      pk: primaryKey(table.mediaId, table.placeId),
    }
  },
)

export const placesToMediasRelations = relations(placesToMedias, ({ one }) => ({
  media: one(medias, {
    fields: [placesToMedias.mediaId],
    references: [medias.id],
  }),
  place: one(places, {
    fields: [placesToMedias.placeId],
    references: [places.id],
  }),
}))

// PlaceToAddress table (Many-to-Many Mapping)
export const placesToAddresses = mysqlTable(
  'places_to_addresses',
  {
    addressId: bigint('address_id', { mode: 'number' }).notNull(),
    placeId: bigint('place_id', { mode: 'number' }).notNull(),
  },
  (table) => {
    return {
      pk: primaryKey(table.addressId, table.placeId),
    }
  },
)
export const placesToAddressesRelations = relations(
  placesToAddresses,
  ({ one }) => ({
    address: one(medias, {
      fields: [placesToAddresses.addressId],
      references: [medias.id],
    }),
    place: one(places, {
      fields: [placesToAddresses.placeId],
      references: [places.id],
    }),
  }),
)
