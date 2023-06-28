import { customAlphabet } from 'nanoid'

import { eq, InferModel } from 'drizzle-orm'
import { db } from '@/server/services/database'
import { tag } from '@/server/schemas/database'

type NewTag = Omit<
  InferModel<typeof tag, 'insert'>,
  'id' | 'uuid' | 'createdAt' | 'updateAt'
>
type Tag = InferModel<typeof tag>

const nanoid = customAlphabet(
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz',
  12,
)

function logError(error: unknown, context: string) {
  // eslint-disable-next-line no-console
  console.error(
    `[${context}] ${error instanceof Error ? error.message : error}`,
  )
}

export const getTagById = async (id: number) => {
  try {
    const [tagData] = await db.select().from(tag).where(eq(tag.id, id)).limit(1)
    return tagData
  } catch (error) {
    logError(error, 'Tag Repository - getTagById')
    throw error
  }
}

export const getTagBySlug = async (slug: string) => {
  try {
    const [tagData] = await db
      .select()
      .from(tag)
      .where(eq(tag.slug, slug))
      .limit(1)
    return tagData
  } catch (error) {
    logError(error, 'Tag Repository - getTagBySlug')
    throw error
  }
}

export const getTagByUUID = async (uuid: string) => {
  try {
    const [tagData] = await db
      .select()
      .from(tag)
      .where(eq(tag.uuid, uuid))
      .limit(1)
    return tagData
  } catch (error) {
    logError(error, 'Tag Repository - getTagByUUID')
    throw error
  }
}

export const createTag = async (data: NewTag) => {
  try {
    if (await getTagBySlug(data.slug)) {
      throw new Error('Tag already exists')
    }
    const uuid = nanoid()

    const newTag = await db.insert(tag).values({ ...data, uuid, status: false })
    if (!newTag.insertId) throw new Error('Tag not created')
    return newTag
  } catch (error) {
    logError(error, 'Tag Repository - createTag')
    throw error
  }
}

type UpdateTagOptions = Partial<Pick<Tag, 'id' | 'uuid' | 'slug'>>
type UpdateTag = Partial<
  Pick<Tag, 'slug' | 'description' | 'iconName' | 'status'>
>

export const updateTag = async (options: UpdateTagOptions, data: UpdateTag) => {
  try {
    const { id, uuid, slug } = options
    let whereConditions = null

    if (!id && !uuid && !slug) {
      throw new Error('No tag identifier provided')
    }

    if (id) whereConditions = eq(tag.id, id)
    if (uuid) whereConditions = eq(tag.uuid, uuid)
    if (slug) whereConditions = eq(tag.slug, slug)

    if (!whereConditions) throw new Error('No tag identifier provided')

    const updatedTag = await db.update(tag).set(data).where(whereConditions)
    if (!updatedTag.rowsAffected) throw new Error('Tag not created')
    return updatedTag
  } catch (error) {
    logError(error, 'Tag Repository - updateTag')
    throw error
  }
}

export const activateTag = async (options: UpdateTagOptions) => {
  try {
    return await updateTag(options, { status: false })
  } catch (error) {
    logError(error, 'Tag Repository - activateTag')
    throw error
  }
}

export const deactivateTag = async (options: UpdateTagOptions) => {
  try {
    return await updateTag(options, { status: false })
  } catch (error) {
    logError(error, 'Tag Repository - deactivateTag')
    throw error
  }
}

export const deleteTag = async (id: number) => {
  try {
    const deteledTag = await db.delete(tag).where(eq(tag.id, id))
    if (!deteledTag.rowsAffected) throw new Error('Tag not deleted')
    return deteledTag
  } catch (error) {
    logError(error, 'Tag Repository - deleteTag')
    throw error
  }
}

export default {
  getTagById,
  getTagByUUID,
  createTag,
  updateTag,
  deleteTag,
}
