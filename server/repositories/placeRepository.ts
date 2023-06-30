import { consola } from 'consola'
import { eq, InferModel } from 'drizzle-orm'
import { nanoid } from '@/server/services/uuid'
import { db } from '@/server/services/database'
import { place } from '@/server/schemas/database'

type Identifier = Partial<
  Pick<InferModel<typeof place>, 'id' | 'uuid' | 'slug'>
>
type NewPlace = Omit<
  InferModel<typeof place, 'insert'>,
  'id' | 'uuid' | 'createdAt' | 'updatedAt'
>
type UpdatePlace = Partial<
  Pick<
    InferModel<typeof place>,
    | 'name'
    | 'description'
    | 'slug'
    | 'ratingLevel'
    | 'ratingCount'
    | 'pricingLevel'
    | 'pricingLevelCount'
    | 'coverMediaId'
    | 'avatarMediaId'
    | 'active'
    | 'externalId'
    | 'addressId'
  >
>

const logError = (error: unknown, context: string) => {
  consola.error(
    `[${context}] ${error instanceof Error ? error.message : error}`,
  )
}

const prepareCondition = (options: Identifier) => {
  const { id, uuid, slug } = options

  if (id) return eq(place.id, id)
  if (uuid) return eq(place.uuid, uuid)
  if (slug) return eq(place.slug, slug)

  throw new Error('No place identifier provided')
}

export const getPlace = async (options: Identifier) => {
  try {
    const whereConditions = prepareCondition(options)
    const [placeData] = await db
      .select()
      .from(place)
      .where(whereConditions)
      .limit(1)
    return placeData
  } catch (error) {
    logError(error, 'Place Repository - getPlace')
    throw error
  }
}

export const createPlace = async (data: NewPlace) => {
  try {
    const uuid = nanoid()
    const newPlace = await db.insert(place).values({ uuid, ...data })

    if (!newPlace.insertId) throw new Error('Place not created')
    return newPlace
  } catch (error) {
    logError(error, 'Place Repository - createPlace')
    throw error
  }
}

export const updatePlace = async (options: Identifier, data: UpdatePlace) => {
  try {
    const whereConditions = prepareCondition(options)
    const updatedPlace = await db.update(place).set(data).where(whereConditions)

    if (!updatedPlace.rowsAffected) throw new Error('Place not updated')
    return updatedPlace
  } catch (error) {
    logError(error, 'Place Repository - updatePlace')
    throw error
  }
}

export const deletePlace = async (options: Identifier) => {
  try {
    const whereConditions = prepareCondition(options)
    const deletedPlace = await db.delete(place).where(whereConditions)
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
