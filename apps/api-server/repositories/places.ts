import * as _ from 'radash'
import { consola } from 'consola'
import {
  and,
  or,
  eq,
  type InferSelectModel,
  type InferInsertModel,
  gte,
  lte,
} from 'drizzle-orm'

import {
  UpdatePlace,
  CreatePlace,
  UpdatePlaceCategories,
  UpdatePlaceTags,
} from '../schemas/endpoints'
import { generateUuid } from '../services/nanoid'
import { db } from '../services/database'
import {
  places as PlacesTable,
  cities as CitiesTable,
  placesToCategories as PlacesToCategoriesTable,
  placesToTags as PlacesToTagsTable,
} from '../schemas/db/places'
import { categories as CategoriesTable } from '../schemas/db/categories'
import { tags as TagsTable } from '../schemas/db/tags'
import { medias } from '../schemas/db/medias'
import { getTagsByKeys } from '../repositories/tags'
import { getCategoriesByKeys } from '../repositories/categories'
import {
  CreateOpeningHours,
  CreateSpecialOpeningHours,
  UpdateSpecialOpeningHours,
} from '../schemas/endpoints/openingHours'
import {
  openingHours as OpeningHoursTable,
  specialOpeningHours as SpecialOpeningHoursTable,
} from '../schemas/db/openingHours'

export type SelectPlace = InferSelectModel<typeof PlacesTable>
export type InsertPlace = InferInsertModel<typeof PlacesTable>

export type Identifier = {
  id: number | string
  uuid: string
  slug: string
}

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

const logger = consola.withTag('api:repository:places')

const logError = (error: unknown, context: string) => {
  logger.error(`[${context}] ${error instanceof Error ? error.message : error}`)
}

const prepareCondition = (options: Partial<Identifier>) => {
  const { id, uuid, slug } = options

  if (id) return eq(PlacesTable.id, Number(id))
  if (uuid) return eq(PlacesTable.uuid, uuid)
  if (slug) return eq(PlacesTable.slug, slug)

  throw new Error('No place identifier provided')
}

export const getRawPlace = async (identifiers: Partial<Identifier>) => {
  const whereConditions = prepareCondition(identifiers)

  const [place] = await db.select().from(PlacesTable).where(whereConditions)

  return place
}

export const getPlaceId = async (identifiers: Partial<Identifier>) => {
  try {
    const whereConditions = prepareCondition(identifiers)

    const [place] = await db
      .select({
        id: PlacesTable.id,
      })
      .from(PlacesTable)
      .where(whereConditions)

    if (!place?.id) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Place not found',
      })
    }

    return place.id
  } catch (error) {
    logError(error, 'Place Repository - getPlaceId')
    throw error
  }
}

export const getPlace = async (identifiers: Partial<Identifier>) => {
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

export const getPlaceCategories = async (identifiers: Partial<Identifier>) => {
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

export const getPlaceTags = async (identifiers: Partial<Identifier>) => {
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

export const getPlaceOpeningHours = async (
  identifiers: Partial<Identifier>,
) => {
  try {
    const whereConditions = prepareCondition(identifiers)

    const placeData = await db
      .select({
        openingHours: OpeningHoursTable,
        places: PlacesTable,
      })
      .from(OpeningHoursTable)
      .leftJoin(PlacesTable, eq(OpeningHoursTable.placeId, PlacesTable.id))
      .where(whereConditions)

    return (
      placeData?.map((el) =>
        _.omit(
          {
            ...el.openingHours,
            placeUuid: el.places?.uuid,
            placeSlug: el.places?.slug,
          },
          ['id', 'placeId'],
        ),
      ) ?? []
    )
  } catch (error) {
    logError(error, 'Place Repository - getPlaceOpeningHours')
    throw error
  }
}

export const getPlaceSpecialOpeningHours = async (
  identifiers: Partial<Identifier>,
) => {
  try {
    const whereConditions = prepareCondition(identifiers)

    const placeData = await db
      .select({
        specialOpeningHours: SpecialOpeningHoursTable,
        places: PlacesTable,
      })
      .from(SpecialOpeningHoursTable)
      .leftJoin(
        PlacesTable,
        eq(SpecialOpeningHoursTable.placeId, PlacesTable.id),
      )
      .where(whereConditions)

    return (
      placeData?.map((el) =>
        _.omit(
          {
            ...el.specialOpeningHours,
            placeUuid: el.places?.uuid,
            placeSlug: el.places?.slug,
          },
          ['id', 'placeId'],
        ),
      ) ?? []
    )
  } catch (error) {
    logError(error, 'Place Repository - getPlaceOpeningHours')
    throw error
  }
}

export const getPlaceSpecialOpeningHoursById = async (id: Identifier['id']) => {
  try {
    const placeData = await db
      .select()
      .from(SpecialOpeningHoursTable)
      .where(eq(SpecialOpeningHoursTable.id, Number(id)))

    return placeData?.map((el) => _.omit(el, ['id'])) ?? []
  } catch (error) {
    logError(error, 'Place Repository - getPlaceSpecialOpeningHoursById')
    throw error
  }
}

export const getPlaceSpecialOpeningHoursByUuid = async (
  uuid: Identifier['uuid'],
) => {
  try {
    const placeData = await db
      .select()
      .from(SpecialOpeningHoursTable)
      .where(eq(SpecialOpeningHoursTable.uuid, uuid))

    return placeData?.map((el) => _.omit(el, ['id'])) ?? []
  } catch (error) {
    logError(error, 'Place Repository - getPlaceSpecialOpeningHoursByUuid')
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

    consola.log('city', city)

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
      featuredMedias: data.featuredMedias,
      avatarMedia: data.avatar,
      coverMedia: data.cover,
    }
    consola.log('payload', payload)
    const [newPlace] = await db.insert(PlacesTable).values(payload)
    consola.log('newPlace', newPlace)
    if (!newPlace) throw new Error('Place not created')

    if (data.categories?.length) {
      consola.log('data.categories?.length', data.categories?.length)
      await updatePlaceCategories({ id: newPlace.insertId }, data.categories)
    }

    if (data.tags?.length) {
      consola.log('data.tags?.length', data.tags?.length)
      await updatePlaceTags({ id: newPlace.insertId }, data.tags)
    }

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

export const createPlaceOpeningHours = async (
  options: Partial<Identifier>,
  data: CreateOpeningHours,
) => {
  try {
    const placeId = await getPlaceId(options)
    if (!placeId) throw new Error('Place not found')

    const payload = data.map((openingHour) => {
      const period = openingHour.period ?? [[0, 0]]
      return {
        placeId,
        uuid: generateUuid(),
        dayOfWeek: openingHour.dayOfWeek,
        active: openingHour.active,
        isOpen24Hours: openingHour.isOpen24Hours,
        isClosed: openingHour.isClosed,
        openTime1: period[0][0],
        closeTime1: period[0][1],
        openTime2: period[1]?.[0],
        closeTime2: period[1]?.[1],
      }
    })

    await db
      .delete(OpeningHoursTable)
      .where(eq(OpeningHoursTable.placeId, placeId))

    await db.insert(OpeningHoursTable).values(payload)
    return getPlaceOpeningHours(options)
  } catch (error) {
    logger.error(error)
    logError(error, 'Place Repository - createPlaceOpeningHours')
    throw error
  }
}

export const createPlaceSpecialOpeningHours = async (
  options: Partial<Identifier>,
  data: CreateSpecialOpeningHours,
) => {
  try {
    const placeId = await getPlaceId(options)
    if (!placeId) throw new Error('Place not found')

    const period = data.period ?? [[0, 0]]

    const payload = {
      placeId,
      uuid: generateUuid(),
      description: data.description,
      startDate: data.startDate,
      endDate: data.endDate,
      isOpen24Hours: data.isOpen24Hours,
      isClosed: data.isClosed,
      openTime1: period[0][0],
      closeTime1: period[0][1],
      openTime2: period[1]?.[0],
      closeTime2: period[1]?.[1],
    }

    const [newSpecialOpeningHours] = await db
      .insert(SpecialOpeningHoursTable)
      .values(payload)

    if (!newSpecialOpeningHours.insertId)
      throw new Error('Special Opening Hours not created')

    return getPlaceSpecialOpeningHoursById(newSpecialOpeningHours.insertId)
  } catch (error) {
    logger.error(error)
    logError(error, 'Place Repository - createPlaceSpecialOpeningHours')
    throw error
  }
}

export const updatePlace = async (
  options: Partial<Identifier>,
  data: UpdatePlace,
) => {
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
      ...(data.avatar && { avatarMedia: data.avatar }),
      ...(data.cover && { coverMedia: data.cover }),
      ...(data.featuredMedias && { featuredMedias: data.featuredMedias }),
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

      const [updatedPlace] = await tx
        .update(PlacesTable)
        .set(payload)
        .where(whereConditions)

      if (!updatedPlace.affectedRows) {
        await tx.rollback()
        throw createError({ status: 400, statusMessage: 'Place not updated' })
      }
    })

    return getPlace(options)
  } catch (error) {
    logger.error(error)
    logError(error, 'Place Repository - updatePlace')
    throw error
  }
}

export const updatePlaceCategories = async (
  options: Partial<Identifier>,
  data: UpdatePlaceCategories,
) => {
  try {
    const placeId = await getPlaceId(options)

    if (!placeId)
      throw createError({
        status: 404,
        statusMessage: 'Place not found',
      })

    const categories = await getCategoriesByKeys(data)

    if (!categories.length) return []

    await db
      .delete(PlacesToCategoriesTable)
      .where(eq(PlacesToCategoriesTable.placeId, placeId))

    consola.log(
      'categories',
      categories.map((category) => ({
        categoryId: category.id,
        placeId,
      })),
    )

    await db.insert(PlacesToCategoriesTable).values(
      categories.map((category) => ({
        categoryId: category.id,
        placeId,
      })),
    )

    return getPlaceCategories(options)
  } catch (error) {
    logError(error, 'Place Repository - updatePlaceCategories')
    throw error
  }
}

export const updatePlaceTags = async (
  options: Partial<Identifier>,
  data: UpdatePlaceTags,
) => {
  try {
    const placeId = await getPlaceId(options)

    if (!placeId)
      throw createError({
        status: 404,
        statusMessage: 'Place not found',
      })

    const tags = await getTagsByKeys(data)

    if (tags.length === 0) return []

    await db
      .delete(PlacesToTagsTable)
      .where(eq(PlacesToTagsTable.placeId, placeId))

    await db.insert(PlacesToTagsTable).values(
      tags.map((tag) => ({
        tagId: tag.id,
        placeId,
      })),
    )

    return getPlaceTags(options)
  } catch (error) {
    logError(error, 'Place Repository - updatePlaceTags')
    throw error
  }
}

export const updateSpecialOpeningHours = async (
  uuid: Identifier['uuid'],
  data: UpdateSpecialOpeningHours,
) => {
  try {
    const period = data.period ?? [[0, 0]]

    const payload = {
      ...(typeof data.description === 'string' && {
        description: data.description,
      }),
      ...(typeof data.isOpen24Hours === 'boolean' && {
        isOpen24Hours: data.isOpen24Hours,
      }),
      ...(typeof data.isClosed === 'boolean' && { isClosed: data.isClosed }),
      ...(data.period && {
        openTime1: period[0][0],
        closeTime1: period[0][1],
        openTime2: period[1]?.[0],
        closeTime2: period[1]?.[1],
      }),

      ...(data.startDate && { startDate: data.startDate }),
      ...(data.endDate && { endDate: data.endDate }),
    }

    const [updatedSpecialOpeningHours] = await db
      .update(SpecialOpeningHoursTable)
      .set(payload)
      .where(eq(SpecialOpeningHoursTable.uuid, uuid))

    if (!updatedSpecialOpeningHours.affectedRows)
      throw new Error('Special Opening Hours not updated')

    logger.log(updatedSpecialOpeningHours)

    return getPlaceSpecialOpeningHoursByUuid(uuid)
  } catch (error) {
    logError(error, 'Place Repository - updateSpecialOpeningHours')
    throw error
  }
}

const checkHours = (
  hours: Pick<
    InferSelectModel<typeof OpeningHoursTable>,
    | 'isClosed'
    | 'isOpen24Hours'
    | 'openTime1'
    | 'closeTime1'
    | 'openTime2'
    | 'closeTime2'
  >,
  currentTime: number,
) => {
  if (hours.isClosed) {
    return false
  } else if (hours.isOpen24Hours) {
    return true
  } else if (
    (hours.openTime1 <= currentTime && currentTime <= hours.closeTime1) ||
    (hours.openTime2 !== null &&
      hours.closeTime2 !== null &&
      hours.openTime2 <= currentTime &&
      currentTime <= hours.closeTime2)
  ) {
    return true
  }
  return false
}

export const isPlaceOpen = async (identifiers: Partial<Identifier>) => {
  try {
    const localLogger = logger.withTag('isPlaceOpen')
    const placeId = await getPlaceId(identifiers)

    const today = new Date() // pega data e horário UTC
    const todayDate = today.toISOString().split('T')[0]
    const dayOfWeek = today.getDay() + 1
    const currentTime = today.getHours() * 100 + today.getMinutes() // Hora atual no mesmo formato que o tempo de abertura

    localLogger.log('dayOfWeek', dayOfWeek, today, dayOfWeek)

    const openingHours = await db
      .select()
      .from(OpeningHoursTable)
      .where(
        and(
          eq(OpeningHoursTable.placeId, placeId),
          eq(OpeningHoursTable.dayOfWeek, dayOfWeek),
        ),
      )

    const specialOpeningHours = await db
      .select()
      .from(SpecialOpeningHoursTable)
      .where(
        and(
          eq(SpecialOpeningHoursTable.placeId, placeId),
          and(
            lte(SpecialOpeningHoursTable.startDate, todayDate),
            gte(SpecialOpeningHoursTable.endDate, todayDate),
          ),
        ),
      )

    // Verifica o horário especial
    const specialHour = specialOpeningHours.find(
      (hours) => hours.startDate <= todayDate && hours.endDate >= todayDate,
    )

    if (specialHour) {
      localLogger.log('specialHour', specialHour, currentTime)
      return checkHours(specialHour, currentTime)
    }

    // Verifica o horário regular
    const regularHour = openingHours.find(
      (hours) => hours?.dayOfWeek === dayOfWeek,
    )

    if (regularHour) {
      localLogger.log('regularHour', regularHour, currentTime)
      return checkHours(regularHour, currentTime)
    }

    return false
  } catch (error) {
    logError(error, 'Place Repository - isPlaceOpen')
    throw error
  }
}

export const deletePlace = async (options: Partial<Identifier>) => {
  try {
    const whereConditions = prepareCondition(options)
    const [deletedPlace] = await db.delete(PlacesTable).where(whereConditions)
    if (!deletedPlace.affectedRows) throw new Error('Place not deleted')
    return deletedPlace
  } catch (error) {
    logError(error, 'Place Repository - deletePlace')
    throw error
  }
}

export default {
  getPlace,
  getPlaceCategories,
  getPlaceTags,
  getPlaceOpeningHours,
  getPlaceSpecialOpeningHours,
  getPlaceSpecialOpeningHoursById,
  createPlace,
  createPlaceOpeningHours,
  createPlaceSpecialOpeningHours,
  updatePlace,
  updatePlaceCategories,
  updatePlaceTags,
  deletePlace,
}
