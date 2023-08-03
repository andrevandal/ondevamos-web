import { consola } from 'consola'
import { eq, InferModel } from 'drizzle-orm'
import { generateUuid } from '@/server/services/nanoid'
import { db } from '@/server/services/database'
import { attractions } from '@/server/schemas/db/attractions'

type Identifier = Partial<
  Pick<InferModel<typeof attractions>, 'id' | 'uuid' | 'placeId'>
>
type NewAttraction = Omit<
  InferModel<typeof attractions, 'insert'>,
  'id' | 'uuid' | 'createdAt' | 'updatedAt'
>
type UpdateAttraction = Partial<
  Pick<
    InferModel<typeof attractions>,
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

  if (id) return eq(attractions.id, id)
  if (uuid) return eq(attractions.uuid, uuid)
  if (placeId) return eq(attractions.placeId, placeId)

  throw new Error('No attraction identifier provided')
}

export const getAttraction = async (options: Identifier) => {
  try {
    const whereConditions = prepareCondition(options)
    const [attractionData] = await db
      .select()
      .from(attractions)
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
    const uuid = generateUuid()
    const newAttraction = await db.insert(attractions).values({ uuid, ...data })

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
      .update(attractions)
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
    const deletedAttraction = await db
      .delete(attractions)
      .where(whereConditions)
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
