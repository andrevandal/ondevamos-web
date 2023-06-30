import { consola } from 'consola'
import { eq, InferModel } from 'drizzle-orm'
import { nanoid } from '@/server/services/uuid'
import { db } from '@/server/services/database'
import { attraction } from '@/server/schemas/database'

type Identifier = Partial<
  Pick<InferModel<typeof attraction>, 'id' | 'uuid' | 'placeId'>
>
type NewAttraction = Omit<
  InferModel<typeof attraction, 'insert'>,
  'id' | 'uuid' | 'createdAt' | 'updatedAt'
>
type UpdateAttraction = Partial<
  Pick<
    InferModel<typeof attraction>,
    'title' | 'description' | 'mediaId' | 'isFeatured'
  >
>

const logError = (error: unknown, context: string) => {
  consola.error(
    `[${context}] ${error instanceof Error ? error.message : error}`,
  )
}

const prepareCondition = (options: Identifier) => {
  const { id, uuid, placeId } = options

  if (id) return eq(attraction.id, id)
  if (uuid) return eq(attraction.uuid, uuid)
  if (placeId) return eq(attraction.placeId, placeId)

  throw new Error('No attraction identifier provided')
}

export const getAttraction = async (options: Identifier) => {
  try {
    const whereConditions = prepareCondition(options)
    const [attractionData] = await db
      .select()
      .from(attraction)
      .where(whereConditions)
      .limit(1)
    return attractionData
  } catch (error) {
    logError(error, 'Attraction Repository - getAttraction')
    throw error
  }
}

export const createAttraction = async (data: NewAttraction) => {
  try {
    const uuid = nanoid()
    const newAttraction = await db.insert(attraction).values({ uuid, ...data })

    if (!newAttraction.insertId) throw new Error('Attraction not created')
    return newAttraction
  } catch (error) {
    logError(error, 'Attraction Repository - createAttraction')
    throw error
  }
}

export const updateAttraction = async (
  options: Identifier,
  data: UpdateAttraction,
) => {
  try {
    const whereConditions = prepareCondition(options)
    const updatedAttraction = await db
      .update(attraction)
      .set(data)
      .where(whereConditions)

    if (!updatedAttraction.rowsAffected)
      throw new Error('Attraction not updated')
    return updatedAttraction
  } catch (error) {
    logError(error, 'Attraction Repository - updateAttraction')
    throw error
  }
}

export const deleteAttraction = async (options: Identifier) => {
  try {
    const whereConditions = prepareCondition(options)
    const deletedAttraction = await db.delete(attraction).where(whereConditions)
    if (!deletedAttraction.rowsAffected)
      throw new Error('Attraction not deleted')
    return deletedAttraction
  } catch (error) {
    logError(error, 'Attraction Repository - deleteAttraction')
    throw error
  }
}

export default {
  getAttraction,
  createAttraction,
  updateAttraction,
  deleteAttraction,
}
