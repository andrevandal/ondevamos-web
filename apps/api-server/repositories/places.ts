import { shake } from 'radash'
import { consola } from 'consola'
import { eq, type InferSelectModel, type InferInsertModel } from 'drizzle-orm'

import { db } from '@/services/database'
import {
  PlacesTable,
  PlacesToCategoriesTable,
  PlacesToTagsTable,
  CategoriesTable,
  TagsTable,
  MediasTable,
  OpeningHoursTable,
  SpecialOpeningHoursTable,
} from '@/schemas/db/index'

export type SelectPlace = InferSelectModel<typeof PlacesTable>
export type InsertPlace = InferInsertModel<typeof PlacesTable>

export type SelectPlaceCategories = InferSelectModel<
  typeof PlacesToCategoriesTable
>
export type InsertPlaceCategories = InferInsertModel<
  typeof PlacesToCategoriesTable
>

export type SelectPlaceTags = InferSelectModel<typeof PlacesToTagsTable>
export type InsertPlaceTags = InferInsertModel<typeof PlacesToTagsTable>

export type SelectCategory = InferSelectModel<typeof CategoriesTable>
export type InsertCategory = InferInsertModel<typeof CategoriesTable>

export type SelectTag = InferSelectModel<typeof TagsTable>
export type InsertTag = InferInsertModel<typeof TagsTable>

export type SelectMedia = InferSelectModel<typeof MediasTable>
export type InsertMedia = InferInsertModel<typeof MediasTable>

export type SelectOpeningHours = InferSelectModel<typeof OpeningHoursTable>
export type InsertOpeningHours = InferInsertModel<typeof OpeningHoursTable>

export type SelectSpecialOpeningHours = InferSelectModel<
  typeof SpecialOpeningHoursTable
>
export type InsertSpecialOpeningHours = InferInsertModel<
  typeof SpecialOpeningHoursTable
>

export type PlaceIdentifier = Pick<InsertPlace, 'id' | 'slug'>

const logger = consola.withTag('api:repository:places')

const logError = (error: unknown, context: string) => {
  logger
    .withTag(context)
    .error(`${error instanceof Error ? error.message : error}`)
}

const prepareCondition = (options: Partial<PlaceIdentifier>) => {
  const { id, slug } = options

  if (id) return eq(PlacesTable.id, id)
  if (slug) return eq(PlacesTable.slug, slug)

  throw createError({
    statusCode: 500,
    statusMessage: 'No place identifier provided',
    data: undefined,
    stack: undefined,
  })
}

export type CreatePlace = Omit<InsertPlace, 'id' | 'createdAt' | 'updatedAt'>
export const createPlace = async (data: CreatePlace) => {
  try {
    const [place] = await db.insert(PlacesTable).values(data).returning()

    return place
  } catch (error) {
    logError(error, 'Place Repository - createPlace')
    return null
  }
}

export type CreateOpeningHours = Omit<
  InsertOpeningHours,
  'id' | 'createdAt' | 'updatedAt'
>
export const createPlaceOpeningHours = async (
  placeId: PlaceIdentifier['id'],
  data: CreateOpeningHours[],
) => {
  try {
    await db
      .delete(OpeningHoursTable)
      .where(eq(OpeningHoursTable.placeId, placeId))

    const openingHours = await db
      .insert(OpeningHoursTable)
      .values(data)
      .returning()

    return openingHours
  } catch (error) {
    logError(error, 'Place Repository - createPlaceOpeningHours')
    return null
  }
}

export type CreateSpecialOpeningHours = Omit<
  InsertSpecialOpeningHours,
  'id' | 'createdAt' | 'updatedAt'
>
export const createPlaceSpecialOpeningHours = async (
  data: CreateSpecialOpeningHours,
) => {
  try {
    const [specialOpeningHours] = await db
      .insert(SpecialOpeningHoursTable)
      .values(data)
      .returning()

    return specialOpeningHours
  } catch (error) {
    logError(error, 'Place Repository - createPlaceSpecialOpeningHours')
    return null
  }
}

export type UpdatePlace = Partial<
  Omit<InsertPlace, 'id' | 'createdAt' | 'updatedAt'>
>
export const updatePlace = async (
  options: Partial<PlaceIdentifier>,
  data: UpdatePlace,
) => {
  try {
    const whereConditions = prepareCondition(options)

    const payload = shake(data)

    const [place] = await db
      .update(PlacesTable)
      .set(payload)
      .where(whereConditions)
      .returning()

    return place
  } catch (error) {
    logError(error, 'Place Repository - updatePlace')
    return null
  }
}
export type CategorySlug = SelectCategory['slug']
export const updatePlaceCategories = async (
  placeId: PlaceIdentifier['id'],
  data: CategorySlug[],
) => {
  try {
    const categories = await db.query.CategoriesTable.findMany({
      where: (CategoriesTable, { inArray }) =>
        inArray(CategoriesTable.slug, data),
    }).execute()

    if (!categories.length) return null

    await db
      .delete(PlacesToCategoriesTable)
      .where(eq(PlacesToCategoriesTable.placeId, placeId))

    await db.insert(PlacesToCategoriesTable).values([
      ...categories.map((category) => ({
        categoryId: category.id,
        placeId,
      })),
    ])

    return categories.map((category) => category.slug)
  } catch (error) {
    logError(error, 'Place Repository - updatePlaceCategories')
    return null
  }
}
export type TagSlug = SelectTag['slug']
export const updatePlaceTags = async (
  placeId: PlaceIdentifier['id'],
  data: TagSlug[],
) => {
  try {
    const tags = await db.query.TagsTable.findMany({
      where: (TagsTable, { inArray }) => inArray(TagsTable.slug, data),
    }).execute()

    if (!tags.length) return null

    await db
      .delete(PlacesToTagsTable)
      .where(eq(PlacesToTagsTable.placeId, placeId))

    await db.insert(PlacesToTagsTable).values([
      ...tags.map((tag) => ({
        tagId: tag.id,
        placeId,
      })),
    ])

    return tags.map((tag) => tag.slug)
  } catch (error) {
    logError(error, 'Place Repository - updatePlaceTags')
    return null
  }
}

export type UpdateSpecialOpeningHours = Omit<
  InsertSpecialOpeningHours,
  'createdAt' | 'updatedAt' | 'placeId'
>
export const updateSpecialOpeningHours = async (
  data: UpdateSpecialOpeningHours,
) => {
  try {
    const { id, ...payload } = data
    const [specialOpeningHours] = await db
      .update(SpecialOpeningHoursTable)
      .set(shake(payload))
      .where(eq(SpecialOpeningHoursTable.id, id))
      .returning()

    return specialOpeningHours
  } catch (error) {
    logError(error, 'Place Repository - updateSpecialOpeningHours')
    return null
  }
}

export const deletePlace = async (options: Partial<PlaceIdentifier>) => {
  try {
    const whereConditions = prepareCondition(options)

    const [place] = await db
      .delete(PlacesTable)
      .where(whereConditions)
      .returning()

    return place
  } catch (error) {
    logError(error, 'Place Repository - deletePlace')
    return null
  }
}

export const getPlaceByExternalId = async (externalId: string) => {
  try {
    const place = await db.query.PlacesTable.findFirst({
      where: (PlacesTable, { eq }) => eq(PlacesTable.externalId, externalId),
    }).execute()

    return place
  } catch (error) {
    logError(error, 'Place Repository - getPlaceByExternalId')
    return null
  }
}

export default {
  createPlace,
  createPlaceOpeningHours,
  createPlaceSpecialOpeningHours,
  updatePlace,
  updatePlaceCategories,
  updatePlaceTags,
  updateSpecialOpeningHours,
  deletePlace,
  getPlaceByExternalId,
}
