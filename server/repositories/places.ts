import * as _ from 'radash'
import { consola } from 'consola'
import {
  or,
  eq,
  type InferSelectModel,
  type InferInsertModel,
} from 'drizzle-orm'

import {
  UpdatePlace,
  CreatePlace,
  UpdatePlaceCategories,
  UpdatePlaceTags,
} from '@/server/schemas/endpoints'
import { generateUuid } from '@/server/services/nanoid'
import { db } from '@/server/services/database'
import {
  places as PlacesTable,
  cities as CitiesTable,
  placesToCategories as PlacesToCategoriesTable,
  placesToTags as PlacesToTagsTable,
} from '@/server/schemas/db/places'
import { categories as CategoriesTable } from '@/server/schemas/db/categories'
import { tags as TagsTable } from '@/server/schemas/db/tags'
import { medias } from '@/server/schemas/db/medias'
import { getTagsByKeys } from '@/server/repositories/tags'
import { getCategoriesByKeys } from '@/server/repositories/categories'

export type SelectPlace = InferSelectModel<typeof PlacesTable>
export type InsertPlace = InferInsertModel<typeof PlacesTable>

export type Identifier = Partial<{
  id: number | string
  uuid: string
  slug: string
}>

export type UpdatePlacePayload = Partial<
  Pick<
    InsertPlace,
    | 'name'
    | 'description'
    | 'slug'
    | 'ratingLevel'
    | 'ratingCount'
    | 'pricingLevel'
    | 'pricingCount'
    | 'coverMedia'
    | 'avatarMedia'
    | 'active'
    | 'externalId'
    | 'address'
  >
>

const logError = (error: unknown, context: string) => {
  consola.error(
    `[${context}] ${error instanceof Error ? error.message : error}`,
  )
}

const prepareCondition = (options: Identifier) => {
  const { id, uuid, slug } = options

  if (id) return eq(PlacesTable.id, Number(id))
  if (uuid) return eq(PlacesTable.uuid, uuid)
  if (slug) return eq(PlacesTable.slug, slug)

  throw new Error('No place identifier provided')
}

export const getRawPlace = async (identifiers: Identifier) => {
  const whereConditions = prepareCondition(identifiers)

  const [place] = await db.select().from(PlacesTable).where(whereConditions)

  return place
}

export const getPlaceId = async (identifiers: Identifier) => {
  try {
    const whereConditions = prepareCondition(identifiers)

    const [place] = await db
      .select({
        id: PlacesTable.id,
      })
      .from(PlacesTable)
      .where(whereConditions)

    return place?.id ?? null
  } catch (error) {
    logError(error, 'Place Repository - getPlaceId')
    throw error
  }
}

export const getPlace = async (identifiers: Identifier) => {
  try {
    const whereConditions = prepareCondition(identifiers)

    const [placeData] = await db
      .select({
        uuid: PlacesTable.uuid,
        name: PlacesTable.name,
        slug: PlacesTable.slug,
        description: PlacesTable.description,
        ratingLevel: PlacesTable.ratingLevel,
        ratingCount: PlacesTable.ratingCount,
        pricingLevel: PlacesTable.pricingLevel,
        pricingCount: PlacesTable.pricingCount,
        coverMedia: PlacesTable.coverMedia,
        avatarMedia: PlacesTable.avatarMedia,
        address: PlacesTable.address,
        actions: PlacesTable.actions,
        city: {
          uuid: CitiesTable.uuid,
          name: CitiesTable.name,
        },
        externalId: PlacesTable.externalId,
        active: PlacesTable.active,
        createdAt: PlacesTable.createdAt,
        updatedAt: PlacesTable.updatedAt,
        externalMetadata: PlacesTable.externalMetadata,
      })
      .from(PlacesTable)
      .where(whereConditions)
      .leftJoin(CitiesTable, eq(PlacesTable.city, CitiesTable.id))
      .groupBy(PlacesTable.id)

    return placeData
  } catch (error) {
    logError(error, 'Place Repository - getPlace')
    throw error
  }
}

export const getPlaceCategories = async (identifiers: Identifier) => {
  try {
    const whereConditions = prepareCondition(identifiers)

    const placeData = await db
      .select({
        // places: PlacesTable,
        categories: CategoriesTable,
      })
      .from(PlacesTable)
      .leftJoin(
        PlacesToCategoriesTable,
        eq(PlacesTable.id, PlacesToCategoriesTable.placeId),
      )
      .leftJoin(
        CategoriesTable,
        eq(PlacesToCategoriesTable.categoryId, CategoriesTable.id),
      )
      .where(whereConditions)

    return placeData?.map((el) => _.omit({ ...el.categories }, ['id'])) ?? []
  } catch (error) {
    logError(error, 'Place Repository - getPlaceCategories')
    throw error
  }
}

export const getPlaceTags = async (identifiers: Identifier) => {
  try {
    const whereConditions = prepareCondition(identifiers)

    const placeData = await db
      .select({
        tags: TagsTable,
      })
      .from(PlacesTable)
      .leftJoin(
        PlacesToTagsTable,
        eq(PlacesTable.id, PlacesToTagsTable.placeId),
      )
      .leftJoin(TagsTable, eq(PlacesToTagsTable.tagId, TagsTable.id))
      .where(whereConditions)

    return placeData?.map((el) => _.omit({ ...el.tags }, ['id'])) ?? []
  } catch (error) {
    logError(error, 'Place Repository - getPlaceTags')
    throw error
  }
}

export const createPlace = async (data: CreatePlace) => {
  try {
    const uuid = generateUuid()

    const [city] = await db
      .select({
        id: CitiesTable.id,
      })
      .from(CitiesTable)
      .where(eq(CitiesTable.uuid, data.city))

    if (!city) throw new Error('City not found')

    const payload = {
      uuid,
      name: data.name,
      description: data.description,
      slug: data.slug,
      ratingLevel: data.ratingLevel,
      ratingCount: data.ratingCount,
      pricingLevel: data.pricingLevel,
      pricingCount: data.pricingCount,
      externalId: data.externalId,
      active: data.active,
      ...(data.actions?.length && {
        actions: Array.from(data.actions).map((action) => ({
          name: action.name,
          type: action.type,
          link: action.link,
          ...(action.iconName && {
            icon: {
              name: action.iconName,
              className: action.iconClasses,
            },
          }),
        })),
      }),
      address: {
        street: data.addressStreet,
        number: data.addressNumber,
        complement: data.addressComplement,
        neighborhood: data.addressNeighborhood,
        latitude: data.addressLatitude,
        longitude: data.addressLongitude,
        zipCode: data.addressZipCode,
      },
      city: city.id,
    }

    const newPlace = await db.insert(PlacesTable).values(payload)

    if (!newPlace.insertId) throw new Error('Place not created')
    return getPlace({ id: newPlace.insertId })
  } catch (error) {
    const { message } = error as Error
    logError(error, 'Place Repository - createPlace')

    if (message.includes('code = AlreadyExists')) {
      throw createError({
        statusCode: 400,
        statusMessage: 'You cannot create a place with this slug',
        data: undefined,
        stack: undefined,
      })
    }
    throw error
  }
}

export const updatePlace = async (options: Identifier, data: UpdatePlace) => {
  try {
    const whereConditions = prepareCondition(options)
    const currentPlace = await getRawPlace(options)

    if (!currentPlace) throw new Error('Place not found')

    if (data.avatar || data.cover) {
      let whereConditions = null as any

      if (data.avatar && !data.cover)
        whereConditions = eq(medias.uuid, data.avatar)
      if (data.cover && !data.avatar)
        whereConditions = eq(medias.uuid, data.cover)
      if (data.avatar && data.cover)
        whereConditions = or(
          eq(medias.uuid, data.avatar),
          eq(medias.uuid, data.cover),
        )

      const selectedMedias = await db
        .select()
        .from(medias)
        .where(whereConditions)

      if (!selectedMedias.length) {
        throw createError({ status: 400, statusMessage: 'Media not found' })
      }
    }

    const [categories, tags] =
      data.categories || data.tags
        ? await Promise.all([
            data.categories
              ? getCategoriesByKeys(data.categories)
              : Promise.resolve([]),
            data.tags ? getTagsByKeys(data.tags) : Promise.resolve([]),
          ])
        : []

    const payload = {
      ...(data?.name && { name: data.name }),
      ...(data.description && { description: data.description }),
      ...(data.slug && { slug: data.slug }),
      ...(data.ratingLevel && { ratingLevel: data.ratingLevel }),
      ...(data.ratingCount && { ratingCount: data.ratingCount }),
      ...(data.pricingLevel && { pricingLevel: data.pricingLevel }),
      ...(data.pricingCount && { pricingCount: data.pricingCount }),
      ...(data.active && { active: data.active }),
      ...((data.addressStreet ||
        data.addressNumber ||
        data.addressComplement ||
        data.addressNeighborhood ||
        data.addressLatitude ||
        data.addressLongitude) && {
        address: {
          ...currentPlace.address,
          ...(data.addressStreet && { street: data.addressStreet }),
          ...(data.addressNumber && { number: data.addressNumber }),
          ...(data.addressComplement && { complement: data.addressComplement }),
          ...(data.addressNeighborhood && {
            neighborhood: data.addressNeighborhood,
          }),
          ...(data.addressLatitude && { latitude: data.addressLatitude }),
          ...(data.addressLongitude && { longitude: data.addressLongitude }),
          ...(data.addressZipCode && { zipCode: data.addressZipCode }),
        },
      }),
      actions:
        Array.isArray(data.actions) && data.actions.length
          ? Array.from(data.actions).map((action) => ({
              name: action.name,
              type: action.type,
              link: action.link,
              ...(action.iconName && {
                icon: {
                  name: action.iconName,
                  className: action.iconClasses,
                },
              }),
            }))
          : [],
    }

    await db.transaction(async (tx) => {
      if (categories || tags) {
        const tasks = [categories, tags].reduce(
          (acc: Promise<any>[], values, index) => {
            if (values) {
              const tableName =
                index === 0 ? PlacesToCategoriesTable : PlacesToTagsTable
              const columnName = index === 0 ? 'categoryId' : 'tagId'

              const task = tx
                .delete(tableName)
                .where(eq(tableName.placeId, currentPlace.id))
                .then(() => {
                  // Prepares the new entries to be inserted to the place
                  const entriesInsert = values.map((value) => ({
                    [columnName]: value.id,
                    placeId: currentPlace.id,
                  }))

                  // Inserts all the new entries to the place
                  return tx.insert(tableName).values(entriesInsert)
                })

              acc.push(task)
            }

            return acc
          },
          [],
        )
        await Promise.allSettled(tasks)
      }

      const updatedPlace = await tx
        .update(PlacesTable)
        .set(payload)
        .where(whereConditions)
      if (!updatedPlace.rowsAffected) {
        await tx.rollback()
        throw createError({ status: 400, statusMessage: 'Place not updated' })
      }
    })

    return getPlace(options)
  } catch (error) {
    consola.error(error)
    logError(error, 'Place Repository - updatePlace')
    throw error
  }
}

export const updatePlaceCategories = async (
  options: Identifier,
  data: UpdatePlaceCategories,
) => {
  try {
    const currentPlace = await getRawPlace(options)

    if (!currentPlace)
      throw createError({
        status: 404,
        statusMessage: 'Place not found',
      })

    const categories = await getCategoriesByKeys(data)

    await db.transaction(async (tx) => {
      const tasks = [categories].reduce((acc: Promise<any>[], values) => {
        if (values) {
          const task = tx
            .delete(PlacesToCategoriesTable)
            .where(eq(PlacesToCategoriesTable.placeId, currentPlace.id))
            .then(() => {
              // Prepares the new entries to be inserted to the place
              const entriesInsert = values.map((value) => ({
                categoryId: value.id,
                placeId: currentPlace.id,
              }))

              // Inserts all the new entries to the place
              return tx.insert(PlacesToCategoriesTable).values(entriesInsert)
            })

          acc.push(task)
        }

        return acc
      }, [])

      await Promise.allSettled(tasks)
    })

    return getPlaceCategories(options)
  } catch (error) {
    logError(error, 'Place Repository - updatePlaceCategories')
    throw error
  }
}

export const updatePlaceTags = async (
  options: Identifier,
  data: UpdatePlaceTags,
) => {
  try {
    const currentPlace = await getRawPlace(options)

    if (!currentPlace)
      throw createError({
        status: 404,
        statusMessage: 'Place not found',
      })

    const tags = await getTagsByKeys(data)

    await db.transaction(async (tx) => {
      const tasks = [tags].reduce((acc: Promise<any>[], values) => {
        if (values) {
          const task = tx
            .delete(PlacesToTagsTable)
            .where(eq(PlacesToTagsTable.placeId, currentPlace.id))
            .then(() => {
              // Prepares the new entries to be inserted to the place
              const entriesInsert = values.map((value) => ({
                tagId: value.id,
                placeId: currentPlace.id,
              }))

              // Inserts all the new entries to the place
              return tx.insert(PlacesToTagsTable).values(entriesInsert)
            })

          acc.push(task)
        }

        return acc
      }, [])

      await Promise.allSettled(tasks)
    })

    return getPlaceTags(options)
  } catch (error) {
    logError(error, 'Place Repository - updatePlaceTags')
    throw error
  }
}

export const deletePlace = async (options: Identifier) => {
  try {
    const whereConditions = prepareCondition(options)
    const deletedPlace = await db.delete(PlacesTable).where(whereConditions)
    if (!deletedPlace.rowsAffected) throw new Error('Place not deleted')
    return deletedPlace
  } catch (error) {
    logError(error, 'Place Repository - deletePlace')
    throw error
  }
}

export default {
  getPlace,
  createPlace,
  updatePlace,
  deletePlace,
}
