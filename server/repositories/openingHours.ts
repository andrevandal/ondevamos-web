import { consola } from 'consola'
import { eq, InferModel } from 'drizzle-orm'
import { generateUuid } from '@/server/services/nanoid'
import { db } from '@/server/services/database'
import { openingHours } from '@/server/schemas/db/openingHours'

type Identifier = Partial<
  Pick<InferModel<typeof openingHours>, 'id' | 'uuid' | 'placeId'>
>
type NewopeningHours = Omit<
  InferModel<typeof openingHours, 'insert'>,
  'id' | 'uuid' | 'createdAt' | 'updatedAt'
>
type UpdateopeningHours = Partial<
  Pick<InferModel<typeof openingHours>, 'openTime' | 'closeTime'>
>

const logError = (error: unknown, context: string) => {
  consola.error(
    `[${context}] ${error instanceof Error ? error.message : error}`,
  )
}

const prepareCondition = (options: Identifier) => {
  const { id, uuid, placeId } = options

  if (id) return eq(openingHours.id, id)
  if (uuid) return eq(openingHours.uuid, uuid)
  if (placeId) return eq(openingHours.placeId, placeId)

  throw new Error('No opening hour identifier provided')
}

export const getopeningHours = async (options: Identifier) => {
  try {
    const whereConditions = prepareCondition(options)
    const [openingHoursData] = await db
      .select()
      .from(openingHours)
      .where(whereConditions)
      .limit(1)
    return openingHoursData
  } catch (error) {
    logError(error, 'openingHours Repository - getopeningHours')
    throw error
  }
}

export const createopeningHours = async (data: NewopeningHours) => {
  try {
    const uuid = generateUuid()
    const newopeningHours = await db
      .insert(openingHours)
      .values({ uuid, ...data })

    if (!newopeningHours.insertId) throw new Error('Opening hour not created')
    return newopeningHours
  } catch (error) {
    logError(error, 'openingHours Repository - createopeningHours')
    throw error
  }
}

export const updateopeningHours = async (
  options: Identifier,
  data: UpdateopeningHours,
) => {
  try {
    const whereConditions = prepareCondition(options)
    const updatedopeningHours = await db
      .update(openingHours)
      .set(data)
      .where(whereConditions)

    if (!updatedopeningHours.rowsAffected)
      throw new Error('Opening hour not updated')
    return updatedopeningHours
  } catch (error) {
    logError(error, 'openingHours Repository - updateopeningHours')
    throw error
  }
}

export const deleteopeningHours = async (id: number) => {
  try {
    const deletedopeningHours = await db
      .delete(openingHours)
      .where(eq(openingHours.id, id))
    if (!deletedopeningHours.rowsAffected)
      throw new Error('Opening hour not deleted')
    return deletedopeningHours
  } catch (error) {
    logError(error, 'openingHours Repository - deleteopeningHours')
    throw error
  }
}

export default {
  getopeningHours,
  createopeningHours,
  updateopeningHours,
  deleteopeningHours,
}
