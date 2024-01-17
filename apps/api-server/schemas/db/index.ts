import {
  integer,
  pgTable,
  uuid,
  primaryKey,
  varchar,
  text,
  timestamp,
  index,
  uniqueIndex,
  json,
  boolean,
  numeric,
  date,
  pgEnum,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

export type externalMetadata = Partial<{}>

export type Icon = {
  name: string
  className?: string
}

export type PlaceAction = Partial<{
  type: string
  name: string
  label: string
  link?: string
  icon?: Icon
}>

export type PlaceActions = Partial<PlaceAction[]>

export type PlaceAddress = Partial<{
  street: string
  number: string
  complement: string
  neighborhood: string
  zipCode: string
  latitude: number
  longitude: number
}>

export type CitiesExternalMetadata = Partial<{}>

export const CitiesTable = pgTable(
  'cities',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    ibgeCode: varchar('ibge_code', { length: 7 }).unique().notNull(),
    slug: varchar('slug', { length: 100 }).unique().notNull(),
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
  (t) => ({
    ibgeCodeIdx: uniqueIndex().on(t.ibgeCode),
    slugIdx: uniqueIndex().on(t.slug),
    nameIdx: index().on(t.name),
  }),
)

export const CategoriesTable = pgTable(
  'categories',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    slug: varchar('slug', { length: 100 }).unique().notNull(),
    name: varchar('name', { length: 100 }).notNull(),
    label: varchar('label', { length: 100 }).notNull(),
    description: text('description'),
    icon: json('icon').$type<Icon>(),
    active: boolean('active').default(false),
    createdAt: timestamp('created_at', { mode: 'string' })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { mode: 'string' }),
  },
  (t) => ({
    slugIdx: uniqueIndex().on(t.slug),
  }),
)

export const TagsTable = pgTable('tags', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: varchar('slug', { length: 100 }).unique().notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  label: varchar('label', { length: 100 }).notNull(),
  description: text('description'),
  icon: json('icon').$type<Icon>(),
  active: boolean('active').default(false),
  createdAt: timestamp('created_at', { mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'string' }),
})

export const PlacesTable = pgTable(
  'places',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    slug: varchar('slug', { length: 100 }).unique().notNull(),
    description: text('description'),
    ratingLevel: numeric('rating_level', { precision: 2 }),
    ratingCount: integer('rating_count'),
    pricingLevel: integer('pricing_level'),
    pricingCount: integer('pricing_count'),
    address: json('address').$type<PlaceAddress>(),
    actions: json('actions').$type<PlaceAction[]>(),
    coverMedia: uuid('cover_media_id').references(() => MediasTable.id),
    avatarMedia: uuid('avatar_media_id').references(() => MediasTable.id),
    city: uuid('city_id')
      .notNull()
      .references(() => CitiesTable.id),
    externalId: varchar('external_id', { length: 128 }),
    active: boolean('active').default(false),
    createdAt: timestamp('created_at', { mode: 'string' })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { mode: 'string' }),
    externalMetadata: json('external_metadata').$type<externalMetadata>(),
  },
  (t) => ({
    slugIdx: uniqueIndex().on(t.slug),
  }),
)

export const AttractionsTable = pgTable(
  'attractions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    placeId: uuid('place_id')
      .notNull()
      .references(() => PlacesTable.id),
    title: text('title').notNull(),
    description: text('description'),
    mediaId: uuid('media_id').references(() => MediasTable.id),
    featured: boolean('featured').notNull(),
    active: boolean('active').default(false),
    order: integer('order').notNull().default(0),
    createdAt: timestamp('created_at', { mode: 'string' })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { mode: 'string' }),
  },
  (t) => ({
    placeIdx: index().on(t.placeId),
  }),
)

export const PlacesToTagsTable = pgTable(
  'places_to_tags',
  {
    tagId: uuid('tag_id').notNull(),
    placeId: uuid('place_id').notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.tagId, t.placeId] }),
    placeId: index().on(t.placeId),
  }),
)

export const PlacesToCategoriesTable = pgTable(
  'places_to_categories',
  {
    categoryId: uuid('category_id').notNull(),
    placeId: uuid('place_id').notNull(),
  },
  (t) => ({
    pk: { columns: [t.categoryId, t.placeId] },
    placeIdx: index().on(t.placeId),
  }),
)

export const OpeningHoursTable = pgTable(
  'opening_hours',
  {
    id: uuid('uuid').primaryKey().defaultRandom(),
    placeId: uuid('place_id')
      .notNull()
      .references(() => PlacesTable.id),
    dayOfWeek: integer('day_of_week').notNull(),
    openTime1: integer('open_time1').notNull(),
    closeTime1: integer('close_time1').notNull(),
    openTime2: integer('open_time2'),
    closeTime2: integer('close_time2'),
    active: boolean('active').default(false),
    isOpen24Hours: boolean('is_open_24_hours').default(false),
    isClosed: boolean('is_closed').default(false),
    createdAt: timestamp('created_at', { mode: 'string' })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { mode: 'string' }),
  },
  (t) => ({
    placeIdx: uniqueIndex().on(t.placeId),
  }),
)

export const SpecialOpeningHoursTable = pgTable(
  'special_opening_hours',
  {
    id: uuid('uuid').primaryKey().defaultRandom(),
    placeId: uuid('place_id')
      .notNull()
      .references(() => PlacesTable.id),
    description: text('description'),
    startDate: date('start_date', { mode: 'string' }).notNull(),
    endDate: date('end_date', { mode: 'string' }).notNull(),
    openTime1: integer('open_time1').notNull(),
    closeTime1: integer('close_time1').notNull(),
    openTime2: integer('open_time2'),
    closeTime2: integer('close_time2'),
    isOpen24Hours: boolean('is_open_24_hours').default(false),
    isClosed: boolean('is_closed').default(false),
    createdAt: timestamp('created_at', { mode: 'string' })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { mode: 'string' }),
  },
  (t) => ({
    placeIdx: uniqueIndex().on(t.placeId),
  }),
)

export const CategoriesRelations = relations(CategoriesTable, ({ many }) => ({
  places: many(PlacesToCategoriesTable),
}))

export const TagsRelations = relations(TagsTable, ({ many }) => ({
  places: many(PlacesToTagsTable),
}))

export const AttractionsRelations = relations(AttractionsTable, ({ one }) => ({
  places: one(PlacesTable, {
    fields: [AttractionsTable.placeId],
    references: [PlacesTable.id],
  }),
  media: one(MediasTable, {
    fields: [AttractionsTable.mediaId],
    references: [MediasTable.id],
  }),
}))

export const CitiesRelations = relations(CitiesTable, ({ many }) => ({
  place: many(PlacesTable),
}))

export const OpeningHoursRelations = relations(
  OpeningHoursTable,
  ({ one }) => ({
    place: one(PlacesTable, {
      fields: [OpeningHoursTable.placeId],
      references: [PlacesTable.id],
    }),
  }),
)

export const SpecialOpeningHoursRelations = relations(
  SpecialOpeningHoursTable,
  ({ one }) => ({
    place: one(PlacesTable, {
      fields: [SpecialOpeningHoursTable.placeId],
      references: [PlacesTable.id],
      relationName: 'place',
    }),
  }),
)

export const PlacesRelations = relations(PlacesTable, ({ many, one }) => ({
  categories: many(PlacesToCategoriesTable),
  tags: many(PlacesToTagsTable),
  attractions: many(AttractionsTable),
  city: one(CitiesTable, {
    fields: [PlacesTable.city],
    references: [CitiesTable.id],
  }),
  openingHours: many(OpeningHoursTable),
  specialOpeningHours: many(SpecialOpeningHoursTable),
}))

export const PlacesToCategoriesRelations = relations(
  PlacesToCategoriesTable,
  ({ one }) => ({
    category: one(CategoriesTable, {
      fields: [PlacesToCategoriesTable.categoryId],
      references: [CategoriesTable.id],
      relationName: 'category',
    }),
    place: one(PlacesTable, {
      fields: [PlacesToCategoriesTable.placeId],
      references: [PlacesTable.id],
      relationName: 'place',
    }),
  }),
)

export const PlacesToTagsRelations = relations(
  PlacesToTagsTable,
  ({ one }) => ({
    tag: one(TagsTable, {
      fields: [PlacesToTagsTable.tagId],
      references: [TagsTable.id],
      relationName: 'tag',
    }),
    place: one(PlacesTable, {
      fields: [PlacesToTagsTable.placeId],
      references: [PlacesTable.id],
      relationName: 'place',
    }),
  }),
)

type MediaExternalMetadata = Partial<{
  lastModified?: Date
  filename?: string
  size?: number
  type?: 'image/jpeg' | 'image/png'
}>

export const mediaTypeEnum = pgEnum('type', ['image', 'video'])
export const mediaStatusEnum = pgEnum('status', [
  'pending',
  'completed',
  'error',
])

export const MediasTable = pgTable('medias', {
  id: uuid('uuid').primaryKey().defaultRandom(),
  type: mediaTypeEnum('type').notNull(),
  filename: text('filename').notNull(),
  title: text('title'),
  description: text('description'),
  alternativeText: text('alternative_text'),
  url: text('url').notNull(),
  active: boolean('active').default(false),
  status: mediaStatusEnum('status').default('pending'),
  createdAt: timestamp('created_at', { mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'string' }),
  externalMetadata: json('external_metadata').$type<MediaExternalMetadata>(),
})

export const PlacesToMediasTable = pgTable('places_to_medias', {
  placeId: uuid('place_id').notNull(),
  mediaId: uuid('media_id').notNull(),
  featured: boolean('featured').default(false),
  active: boolean('active').default(false),
})

export const PlacesToMediasRelations = relations(
  PlacesToMediasTable,
  ({ one }) => ({
    place: one(PlacesTable, {
      fields: [PlacesToMediasTable.placeId],
      references: [PlacesTable.id],
      relationName: 'place',
    }),
    media: one(MediasTable, {
      fields: [PlacesToMediasTable.mediaId],
      references: [MediasTable.id],
      relationName: 'media',
    }),
  }),
)

export const MediasRelations = relations(MediasTable, ({ many }) => ({
  places: many(PlacesTable),
  attractions: many(AttractionsTable),
}))
