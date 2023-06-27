import {
  mysqlTable,
  bigint,
  varchar,
  text,
  timestamp,
  double,
  int,
  uniqueIndex,
  primaryKey,
} from 'drizzle-orm/mysql-core'

import { relations } from 'drizzle-orm'

// Place table
export const place = mysqlTable(
  'place',
  {
    id: bigint('id', { mode: 'number' }).autoincrement().primaryKey().notNull(),
    uuid: varchar('uuid', { length: 12 }).notNull(),
    name: text('name').notNull(),
    slug: text('slug').notNull(),
    description: text('description'),
    ratingLevel: double('rating_level'),
    ratingCount: int('rating_count'),
    pricingLevel: int('pricing_level'),
    pricingLevelCount: int('pricing_level_count'),
    coverMediaId: bigint('cover_media_id', { mode: 'number' }),
    avatarMediaId: bigint('avatar_media_id', { mode: 'number' }),
    addressId: bigint('address_id', { mode: 'number' }).notNull(),
    openingHourId: bigint('opening_hour_id', { mode: 'number' }),
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

// Category table
export const category = mysqlTable(
  'category',
  {
    id: bigint('id', { mode: 'number' }).autoincrement().primaryKey().notNull(),
    uuid: varchar('uuid', { length: 12 }).notNull(),
    name: text('name').notNull(),
    slug: text('slug').notNull(),
    description: text('description'),
    iconName: text('icon_name'),
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

// Tag table
export const tag = mysqlTable(
  'tag',
  {
    id: bigint('id', { mode: 'number' }).autoincrement().primaryKey().notNull(),
    uuid: varchar('uuid', { length: 12 }).notNull(),
    slug: text('slug').notNull(),
    description: text('description'),
    iconName: text('icon_name'),
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

// Media table
export const media = mysqlTable(
  'media',
  {
    id: bigint('id', { mode: 'number' }).autoincrement().primaryKey().notNull(),
    uuid: varchar('uuid', { length: 12 }).notNull(),
    type: text('type').notNull(),
    title: text('title'),
    description: text('description'),
    alternativeText: text('alternative_text'),
    url: text('url').notNull(),
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

// Action table
export const action = mysqlTable(
  'action',
  {
    id: bigint('id', { mode: 'number' }).autoincrement().primaryKey().notNull(),
    uuid: varchar('uuid', { length: 12 }).notNull(),
    placeId: bigint('place_id', { mode: 'number' }).notNull(),
    title: text('title'),
    link: text('link'),
    iconName: text('icon_name'),
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

// Attraction table
export const attraction = mysqlTable(
  'attraction',
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

// Opening Hour table
export const openingHour = mysqlTable(
  'opening_hour',
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

// Special Opening Hour table
export const specialOpeningHour = mysqlTable(
  'special_opening_hour',
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

// Address table
export const address = mysqlTable(
  'address',
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

// City table
export const city = mysqlTable(
  'city',
  {
    id: bigint('id', { mode: 'number' }).autoincrement().primaryKey().notNull(),
    uuid: varchar('uuid', { length: 12 }).notNull(),
    publicId: varchar('public_id', { length: 12 }).notNull(),
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
    }
  },
)

// PlaceCategory table (Many-to-Many Mapping)
export const placeCategory = mysqlTable(
  'place_category',
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
// PlaceTag table (Many-to-Many Mapping)
export const placeTag = mysqlTable(
  'place_tag',
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

// Category relations
export const categoryRelations = relations(category, ({ many }) => ({
  placesAndCategories: many(placeCategory),
}))

// Tag relations
export const tagRelations = relations(tag, ({ many }) => ({
  placesAndTags: many(placeTag),
}))

// PlaceCategory relations
export const placeCategoryRelations = relations(placeCategory, ({ one }) => ({
  place: one(place, {
    fields: [placeCategory.placeId],
    references: [place.id],
  }),
  category: one(category, {
    fields: [placeCategory.categoryId],
    references: [category.id],
  }),
}))

// PlaceTag relations
export const placeTagRelations = relations(placeTag, ({ one }) => ({
  place: one(place, {
    fields: [placeTag.placeId],
    references: [place.id],
  }),
  tag: one(tag, {
    fields: [placeTag.tagId],
    references: [tag.id],
  }),
}))

export const placeRelations = relations(place, ({ one, many }) => ({
  coverMedia: one(media, {
    fields: [place.coverMediaId],
    references: [media.id],
  }),
  avatarMedia: one(media, {
    fields: [place.avatarMediaId],
    references: [media.id],
  }),
  address: one(address, {
    fields: [place.addressId],
    references: [address.id],
  }),
  actions: many(action),
  attractions: many(attraction),
  openingHours: one(openingHour, {
    fields: [place.openingHourId],
    references: [openingHour.id],
  }),
  categories: many(placeCategory),
  tags: many(placeTag),
}))

export const actionRelations = relations(action, ({ one }) => ({
  place: one(place, { fields: [action.placeId], references: [place.id] }),
}))

export const attractionRelations = relations(attraction, ({ one }) => ({
  place: one(place, { fields: [attraction.placeId], references: [place.id] }),
  media: one(media, { fields: [attraction.mediaId], references: [media.id] }),
}))

export const openingHourRelations = relations(openingHour, ({ one }) => ({
  place: one(place, { fields: [openingHour.placeId], references: [place.id] }),
}))

export const mediaRelations = relations(media, ({ many }) => ({
  coverPlaces: many(place),
  avatarPlaces: many(place),
  attractions: many(attraction),
}))

export const addressRelations = relations(address, ({ many }) => ({
  places: many(place),
}))

export const specialOpeningHourRelations = relations(
  specialOpeningHour,
  ({ one }) => ({
    place: one(place, {
      fields: [specialOpeningHour.placeId],
      references: [place.id],
    }),
  }),
)
