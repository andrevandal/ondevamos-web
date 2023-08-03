import { consola } from 'consola'
import { eq, InferModel } from 'drizzle-orm'
import { generateUuid } from '@/server/services/nanoid'
import { db } from '@/server/services/database'
import { actions } from '@/server/schemas/db/actions'

type Identifier = Partial<
  Pick<InferModel<typeof actions>, 'id' | 'uuid' | 'placeId'>
>
type NewAction = Omit<
  InferModel<typeof actions, 'insert'>,
  'id' | 'uuid' | 'createdAt' | 'updatedAt'
>
type UpdateAction = Partial<
  Pick<InferModel<typeof actions>, 'title' | 'link' | 'iconName'>
>

const logError = (error: unknown, context: string) => {
  consola.error(
    `[${context}] ${error instanceof Error ? error.message : error}`,
  )
}

const prepareCondition = (options: Identifier) => {
  const { id, uuid, placeId } = options

  if (id) return eq(actions.id, id)
  if (uuid) return eq(actions.uuid, uuid)
  if (placeId) return eq(actions.placeId, placeId)

  throw new Error('No action identifier provided')
}

export const getAction = async (options: Identifier) => {
  try {
    const whereConditions = prepareCondition(options)
    const [actionData] = await db
      .select()
      .from(actions)
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
    const uuid = generateUuid()
    const newAction = await db.insert(actions).values({ uuid, ...data })

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
      .update(actions)
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
    const deletedAction = await db.delete(actions).where(whereConditions)
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
