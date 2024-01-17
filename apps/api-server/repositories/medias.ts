import { shake } from 'radash'
import { consola } from 'consola'
import { eq, InferSelectModel, InferInsertModel } from 'drizzle-orm'
import { db } from '@/services/database'
import { MediasTable } from '@/schemas/db/index'

export type SelectMedia = InferSelectModel<typeof MediasTable>
export type InsertMedia = InferInsertModel<typeof MediasTable>

type Identifier = SelectMedia['id']

type NewMedia = Omit<InsertMedia, 'id' | 'uuid' | 'createdAt' | 'updatedAt'>
type UpdateMedia = Partial<
  Pick<
    NewMedia,
    | 'type'
    | 'title'
    | 'description'
    | 'alternativeText'
    | 'url'
    | 'active'
    | 'status'
  >
>

const logError = (error: unknown, context: string) => {
  consola.error(
    `[${context}] ${error instanceof Error ? error.message : error}`,
  )
}

export const createMedia = async (data: NewMedia) => {
  try {
    const [media] = await db.insert(MediasTable).values(data).returning()
    return media
  } catch (error) {
    logError(error, 'Media Repository - createMedia')
    return null
  }
}

export const updateMedia = async (id: Identifier, data: UpdateMedia) => {
  try {
    const [media] = await db
      .update(MediasTable)
      .set(shake(data))
      .where(eq(MediasTable.id, id))
      .returning()
    return media
  } catch (error) {
    logError(error, 'Media Repository - updateMedia')
    return null
  }
}

export const activateMedia = (id: Identifier) =>
  updateMedia(id, { active: true })

export const deactivateMedia = (id: Identifier) =>
  updateMedia(id, { active: false })

export const deleteMedia = async (id: Identifier) => {
  try {
    const [media] = await db
      .delete(MediasTable)
      .where(eq(MediasTable.id, id))
      .returning()

    return media
  } catch (error) {
    logError(error, 'Media Repository - deleteMedia')
    return null
  }
}

export default {
  createMedia,
  updateMedia,
  activateMedia,
  deactivateMedia,
  deleteMedia,
}
