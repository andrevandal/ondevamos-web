import { consola } from 'consola'
import { eq, InferModel } from 'drizzle-orm'
import { generateUuid } from '@/server/services/nanoid'
import { db } from '@/server/services/database'
import { specialOpeningHours } from '@/server/schemas/db/openingHours'

type Identifier = Partial<
  Pick<InferModel<typeof specialOpeningHours>, 'id' | 'uuid' | 'placeId'>
>
type NewSpecialOpeningHour = Omit<
  InferModel<typeof specialOpeningHours, 'insert'>,
  'id' | 'uuid' | 'createdAt' | 'updatedAt'
>
type UpdateSpecialOpeningHour = Partial<
  Pick<InferModel<typeof specialOpeningHours>, 'openTime' | 'closeTime'>
>

const logError = (error: unknown, context: string) => {
  consola.error(
    `[${context}] ${error instanceof Error ? error.message : error}`,
  )
}

const prepareCondition = (options: Identifier) => {
  const { id, uuid, placeId } = options

  if (id) return eq(specialOpeningHours.id, id)
  if (uuid) return eq(specialOpeningHours.uuid, uuid)
  if (placeId) return eq(specialOpeningHours.placeId, placeId)

  throw new Error('No special opening hour identifier provided')
}

export const getSpecialOpeningHour = async (options: Identifier) => {
  try {
    const whereConditions = prepareCondition(options)
    const [specialOpeningHourData] = await db
      .select()
      .from(specialOpeningHours)
      .where(whereConditions)
      .limit(1)
    return specialOpeningHourData
  } catch (error) {
    logError(error, 'SpecialOpeningHour Repository - getSpecialOpeningHour')
    throw error
  }
}

export const createSpecialOpeningHour = async (data: NewSpecialOpeningHour) => {
  try {
    const uuid = generateUuid()
    const newSpecialOpeningHour = await db
      .insert(specialOpeningHours)
      .values({ uuid, ...data })

    if (!newSpecialOpeningHour.insertId)
      throw new Error('Special opening hour not created')
    return newSpecialOpeningHour
  } catch (error) {
    logError(error, 'SpecialOpeningHour Repository - createSpecialOpeningHour')
    throw error
  }
}

export const updateSpecialOpeningHour = async (
  options: Identifier,
  data: UpdateSpecialOpeningHour,
) => {
  try {
    const whereConditions = prepareCondition(options)
    const updatedSpecialOpeningHour = await db
      .update(specialOpeningHours)
      .set(data)
      .where(whereConditions)

    if (!updatedSpecialOpeningHour.rowsAffected)
      throw new Error('Special opening hour not updated')
    return updatedSpecialOpeningHour
  } catch (error) {
    logError(error, 'SpecialOpeningHour Repository - updateSpecialOpeningHour')
    throw error
  }
}

export const deleteSpecialOpeningHour = async (options: Identifier) => {
  try {
    const whereConditions = prepareCondition(options)
    const deletedSpecialOpeningHour = await db
      .delete(specialOpeningHours)
      .where(whereConditions)
    if (!deletedSpecialOpeningHour.rowsAffected)
      throw new Error('Special opening hour not deleted')
    return deletedSpecialOpeningHour
  } catch (error) {
    logError(error, 'SpecialOpeningHour Repository - deleteSpecialOpeningHour')
    throw error
  }
}

export default {
  getSpecialOpeningHour,
  createSpecialOpeningHour,
  updateSpecialOpeningHour,
  deleteSpecialOpeningHour,
}
