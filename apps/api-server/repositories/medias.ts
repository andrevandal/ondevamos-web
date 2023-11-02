import { consola } from 'consola'
import { eq, InferSelectModel, InferInsertModel } from 'drizzle-orm'
import { generateUuid } from '../services/nanoid'
import { db } from '../services/database'
import { medias as MediasDb } from '../schemas/db/medias'

export type SelectMedia = InferSelectModel<typeof MediasDb>
export type InsertMedia = InferInsertModel<typeof MediasDb>

type Identifier = Pick<SelectMedia, 'id' | 'uuid'>

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

const prepareCondition = (options: Partial<Identifier>) => {
  const { id, uuid } = options

  if (id) return eq(MediasDb.id, id)
  if (uuid) return eq(MediasDb.uuid, uuid)

  throw new Error('No media identifier provided')
}

export const getMedia = async (options: Identifier) => {
  try {
    const whereConditions = prepareCondition(options)
    const [mediaData] = await db
      .select()
      .from(MediasDb)
      .where(whereConditions)
      .limit(1)
    return mediaData
  } catch (error) {
    logError(error, 'Media Repository - getMedia')
    throw error
  }
}

export const getMediaId = async (options: Partial<Identifier>) => {
  try {
    const whereConditions = prepareCondition(options)

    const [media] = await db
      .select({
        id: MediasDb.id,
      })
      .from(MediasDb)
      .where(whereConditions)
      .limit(1)
    return media?.id ?? null
  } catch (error) {
    logError(error, 'Media Repository - getMedia')
    throw error
  }
}

export const createMedia = async (data: NewMedia) => {
  try {
    const uuid = generateUuid()
    const [newMedia] = await db
      .insert(MediasDb)
      .values({ ...data, uuid, active: false })

    if (!newMedia.insertId) throw new Error('Media not created')
    return newMedia
  } catch (error) {
    logError(error, 'Media Repository - createMedia')
    throw error
  }
}

export const updateMedia = async (options: Identifier, data: UpdateMedia) => {
  try {
    const whereConditions = prepareCondition(options)
    const [updatedMedia] = await db
      .update(MediasDb)
      .set(data)
      .where(whereConditions)

    if (!updatedMedia.affectedRows) throw new Error('Media not updated')
    return updatedMedia
  } catch (error) {
    logError(error, 'Media Repository - updateMedia')
    throw error
  }
}

export const activateMedia = (options: Identifier) =>
  updateMedia(options, { active: true })

export const deactivateMedia = (options: Identifier) =>
  updateMedia(options, { active: false })

export const deleteMedia = async (options: Identifier) => {
  try {
    const whereConditions = prepareCondition(options)
    const [deletedMedia] = await db.delete(MediasDb).where(whereConditions)
    if (!deletedMedia.affectedRows) throw new Error('Media not deleted')
    return deletedMedia
  } catch (error) {
    logError(error, 'Media Repository - deleteMedia')
    throw error
  }
}

export default {
  getMedia,
  createMedia,
  updateMedia,
  activateMedia,
  deactivateMedia,
  deleteMedia,
}
