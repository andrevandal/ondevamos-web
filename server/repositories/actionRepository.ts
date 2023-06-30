import { consola } from 'consola'
import { eq, InferModel } from 'drizzle-orm'
import { nanoid } from '@/server/services/uuid'
import { db } from '@/server/services/database'
import { action } from '@/server/schemas/database'

type Identifier = Partial<
  Pick<InferModel<typeof action>, 'id' | 'uuid' | 'placeId'>
>
type NewAction = Omit<
  InferModel<typeof action, 'insert'>,
  'id' | 'uuid' | 'createdAt' | 'updatedAt'
>
type UpdateAction = Partial<
  Pick<InferModel<typeof action>, 'title' | 'link' | 'iconName'>
>

const logError = (error: unknown, context: string) => {
  consola.error(
    `[${context}] ${error instanceof Error ? error.message : error}`,
  )
}

const prepareCondition = (options: Identifier) => {
  const { id, uuid, placeId } = options

  if (id) return eq(action.id, id)
  if (uuid) return eq(action.uuid, uuid)
  if (placeId) return eq(action.placeId, placeId)

  throw new Error('No action identifier provided')
}

export const getAction = async (options: Identifier) => {
  try {
    const whereConditions = prepareCondition(options)
    const [actionData] = await db
      .select()
      .from(action)
      .where(whereConditions)
      .limit(1)
    return actionData
  } catch (error) {
    logError(error, 'Action Repository - getAction')
    throw error
  }
}

export const createAction = async (data: NewAction) => {
  try {
    const uuid = nanoid()
    const newAction = await db.insert(action).values({ uuid, ...data })

    if (!newAction.insertId) throw new Error('Action not created')
    return newAction
  } catch (error) {
    logError(error, 'Action Repository - createAction')
    throw error
  }
}

export const updateAction = async (options: Identifier, data: UpdateAction) => {
  try {
    const whereConditions = prepareCondition(options)
    const updatedAction = await db
      .update(action)
      .set(data)
      .where(whereConditions)

    if (!updatedAction.rowsAffected) throw new Error('Action not updated')
    return updatedAction
  } catch (error) {
    logError(error, 'Action Repository - updateAction')
    throw error
  }
}

export const deleteAction = async (options: Identifier) => {
  try {
    const whereConditions = prepareCondition(options)
    const deletedAction = await db.delete(action).where(whereConditions)
    if (!deletedAction.rowsAffected) throw new Error('Action not deleted')
    return deletedAction
  } catch (error) {
    logError(error, 'Action Repository - deleteAction')
    throw error
  }
}

export default {
  getAction,
  createAction,
  updateAction,
  deleteAction,
}
