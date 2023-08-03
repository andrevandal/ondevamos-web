import { consola } from 'consola'
import { eq, InferModel } from 'drizzle-orm'
import { generateUuid } from '@/server/services/nanoid'
import { db } from '@/server/services/database'
import { places } from '@/server/schemas/db/places'

type Identifier = Partial<
  Pick<InferModel<typeof places>, 'id' | 'uuid' | 'slug'>
>
type NewPlace = Omit<
  InferModel<typeof places, 'insert'>,
  'id' | 'uuid' | 'createdAt' | 'updatedAt'
>
type UpdatePlace = Partial<
  Pick<
    InferModel<typeof places>,
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

  if (id) return eq(places.id, id)
  if (uuid) return eq(places.uuid, uuid)
  if (slug) return eq(places.slug, slug)

  throw new Error('No place identifier provided')
}

export const getPlace = async (options: Identifier) => {
  try {
    const whereConditions = prepareCondition(options)
    const [placeData] = await db
      .select()
      .from(places)
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
    const uuid = generateUuid()
    const newPlace = await db.insert(places).values({ uuid, ...data })

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
    const updatedPlace = await db
      .update(places)
      .set(data)
      .where(whereConditions)

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
