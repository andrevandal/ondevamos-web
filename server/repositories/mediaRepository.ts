import { consola } from 'consola'
import { eq, InferModel } from 'drizzle-orm'
import { nanoid } from '@/server/services/uuid'
import { db } from '@/server/services/database'
import { media } from '@/server/schemas/database'

type Identifier = Partial<Pick<InferModel<typeof media>, 'id' | 'uuid'>>
type NewMedia = Omit<
  InferModel<typeof media, 'insert'>,
  'id' | 'uuid' | 'createdAt' | 'updateAt'
>
type UpdateMedia = Partial<
  Pick<
    InferModel<typeof media>,
    'type' | 'title' | 'description' | 'alternativeText' | 'url' | 'active'
  >
>

const logError = (error: unknown, context: string) => {
  consola.error(
    `[${context}] ${error instanceof Error ? error.message : error}`,
  )
}

const prepareCondition = (options: Identifier) => {
  const { id, uuid } = options

  if (id) return eq(media.id, id)
  if (uuid) return eq(media.uuid, uuid)

  throw new Error('No media identifier provided')
}

export const getMedia = async (options: Identifier) => {
  try {
    const whereConditions = prepareCondition(options)
    const [mediaData] = await db
      .select()
      .from(media)
      .where(whereConditions)
      .limit(1)
    return mediaData
  } catch (error) {
    logError(error, 'Media Repository - getMedia')
    throw error
  }
}

export const createMedia = async (data: NewMedia) => {
  try {
    const uuid = nanoid()
    const newMedia = await db
      .insert(media)
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
    const updatedMedia = await db.update(media).set(data).where(whereConditions)

    if (!updatedMedia.rowsAffected) throw new Error('Media not updated')
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
    const deletedMedia = await db.delete(media).where(whereConditions)
    if (!deletedMedia.rowsAffected) throw new Error('Media not deleted')
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
