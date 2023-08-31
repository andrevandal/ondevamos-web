import { consola } from 'consola'
import { eq, type InferSelectModel, type InferInsertModel } from 'drizzle-orm'

// import { z } from 'zod'
// import { omit } from 'radash'
import { UpdatePlace, CreatePlace } from '@/server/schemas/endpoints'
import { generateUuid } from '@/server/services/nanoid'
import { db } from '@/server/services/database'
import { places, cities } from '@/server/schemas/db/places'

export type SelectPlace = InferSelectModel<typeof places>
export type InsertPlace = InferInsertModel<typeof places>

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

  if (id) return eq(places.id, Number(id))
  if (uuid) return eq(places.uuid, uuid)
  if (slug) return eq(places.slug, slug)

  throw new Error('No place identifier provided')
}

export const getRawPlace = async (identifiers: Identifier) => {
  const whereConditions = prepareCondition(identifiers)

  const [place] = await db.select().from(places).where(whereConditions)

  return place
}

export const getPlace = async (identifiers: Identifier) => {
  try {
    const whereConditions = prepareCondition(identifiers)

    const [placeData] = await db
      .select({
        uuid: places.uuid,
        name: places.name,
        slug: places.slug,
        description: places.description,
        ratingLevel: places.ratingLevel,
        ratingCount: places.ratingCount,
        pricingLevel: places.pricingLevel,
        pricingCount: places.pricingCount,
        coverMedia: places.coverMedia,
        avatarMedia: places.avatarMedia,
        address: places.address,
        actions: places.actions,
        city: {
          uuid: cities.uuid,
          name: cities.name,
        },
        externalId: places.externalId,
        active: places.active,
        createdAt: places.createdAt,
        updatedAt: places.updatedAt,
        externalMetadata: places.externalMetadata,
      })
      .from(places)
      .where(whereConditions)
      .leftJoin(cities, eq(places.city, cities.id))
      .groupBy(places.id)

    return placeData
  } catch (error) {
    logError(error, 'Place Repository - getPlace')
    throw error
  }
}

export const createPlace = async (data: CreatePlace) => {
  try {
    const uuid = generateUuid()

    const [city] = await db
      .select({
        id: cities.id,
      })
      .from(cities)
      .where(eq(cities.uuid, data.city))

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

    const newPlace = await db.insert(places).values(payload)

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
      actions: Array.isArray(data.actions)
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

    const updatedPlace = await db
      .update(places)
      .set(payload)
      .where(whereConditions)
    if (!updatedPlace.rowsAffected) throw new Error('Place not updated')

    return getPlace(options)
  } catch (error) {
    consola.error(error)
    logError(error, 'Place Repository - updatePlace')
    throw error
  }
}

export const deletePlace = async (options: Identifier) => {
  try {
    const whereConditions = prepareCondition(options)
    const deletedPlace = await db.delete(places).where(whereConditions)
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
