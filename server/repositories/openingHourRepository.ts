import { consola } from 'consola'
import { eq, InferModel } from 'drizzle-orm'
import { nanoid } from '@/server/services/uuid'
import { db } from '@/server/services/database'
import { openingHour } from '@/server/schemas/database'

type Identifier = Partial<
  Pick<InferModel<typeof openingHour>, 'id' | 'uuid' | 'placeId'>
>
type NewOpeningHour = Omit<
  InferModel<typeof openingHour, 'insert'>,
  'id' | 'uuid' | 'createdAt' | 'updatedAt'
>
type UpdateOpeningHour = Partial<
  Pick<InferModel<typeof openingHour>, 'openTime' | 'closeTime'>
>

const logError = (error: unknown, context: string) => {
  consola.error(
    `[${context}] ${error instanceof Error ? error.message : error}`,
  )
}

const prepareCondition = (options: Identifier) => {
  const { id, uuid, placeId } = options

  if (id) return eq(openingHour.id, id)
  if (uuid) return eq(openingHour.uuid, uuid)
  if (placeId) return eq(openingHour.placeId, placeId)

  throw new Error('No opening hour identifier provided')
}

export const getOpeningHour = async (options: Identifier) => {
  try {
    const whereConditions = prepareCondition(options)
    const [openingHourData] = await db
      .select()
      .from(openingHour)
      .where(whereConditions)
      .limit(1)
    return openingHourData
  } catch (error) {
    logError(error, 'OpeningHour Repository - getOpeningHour')
    throw error
  }
}

export const createOpeningHour = async (data: NewOpeningHour) => {
  try {
    const uuid = nanoid()
    const newOpeningHour = await db
      .insert(openingHour)
      .values({ uuid, ...data })

    if (!newOpeningHour.insertId) throw new Error('Opening hour not created')
    return newOpeningHour
  } catch (error) {
    logError(error, 'OpeningHour Repository - createOpeningHour')
    throw error
  }
}

export const updateOpeningHour = async (
  options: Identifier,
  data: UpdateOpeningHour,
) => {
  try {
    const whereConditions = prepareCondition(options)
    const updatedOpeningHour = await db
      .update(openingHour)
      .set(data)
      .where(whereConditions)

    if (!updatedOpeningHour.rowsAffected)
      throw new Error('Opening hour not updated')
    return updatedOpeningHour
  } catch (error) {
    logError(error, 'OpeningHour Repository - updateOpeningHour')
    throw error
  }
}

export const deleteOpeningHour = async (id: number) => {
  try {
    const deletedOpeningHour = await db
      .delete(openingHour)
      .where(eq(openingHour.id, id))
    if (!deletedOpeningHour.rowsAffected)
      throw new Error('Opening hour not deleted')
    return deletedOpeningHour
  } catch (error) {
    logError(error, 'OpeningHour Repository - deleteOpeningHour')
    throw error
  }
}

export default {
  getOpeningHour,
  createOpeningHour,
  updateOpeningHour,
  deleteOpeningHour,
}
