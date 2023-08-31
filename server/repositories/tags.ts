import { consola } from 'consola'
import { eq, InferModel } from 'drizzle-orm'
import { generateUuid } from '@/server/services/nanoid'
import { db } from '@/server/services/database'
import { tags } from '@/server/schemas/db/tags'

type Identifier = Partial<Pick<InferModel<typeof tags>, 'id' | 'uuid' | 'slug'>>
export type NewTag = Omit<
  InferModel<typeof tags, 'insert'>,
  'id' | 'uuid' | 'createdAt' | 'updatedAt'
>
export type UpdateTag = Partial<
  Pick<InferModel<typeof tags>, 'slug' | 'description' | 'label' | 'active'>
>

const logError = (error: unknown, context: string) => {
  consola.error(
    `[${context}] ${error instanceof Error ? error.message : error}`,
  )
}

const prepareCondition = (options: Identifier) => {
  const { id, uuid, slug } = options

  if (id) return eq(tags.id, id)
  if (uuid) return eq(tags.uuid, uuid)
  if (slug) return eq(tags.slug, slug)

  throw new Error('No tag identifier provided')
}

export const getTag = async (options: Identifier) => {
  try {
    const whereConditions = prepareCondition(options)
    const [tagData] = await db
      .select()
      .from(tags)
      .where(whereConditions)
      .limit(1)
    return tagData
  } catch (error) {
    logError(error, 'Tag Repository - getTagById')
    throw error
  }
}

export const createTag = async (data: NewTag) => {
  try {
    if (await getTag({ slug: data.slug })) throw new Error('Tag already exists')
    const uuid = generateUuid()

    const newTag = await db
      .insert(tags)
      .values({ active: false, ...data, uuid })

    if (!newTag.insertId) throw new Error('Tag not created')
    return newTag
  } catch (error) {
    logError(error, 'Tag Repository - createTag')
    throw error
  }
}

export const updateTag = async (options: Identifier, data: UpdateTag) => {
  try {
    const whereConditions = prepareCondition(options)
    const updatedTag = await db.update(tags).set(data).where(whereConditions)

    if (!updatedTag.rowsAffected) throw new Error('Tag not created')
    return updatedTag
  } catch (error) {
    logError(error, 'Tag Repository - updateTag')
    throw error
  }
}

export const activateTag = (options: Identifier) =>
  updateTag(options, { active: true })

export const deactivateTag = (options: Identifier) =>
  updateTag(options, { active: false })

export const deleteTag = async (options: Identifier) => {
  try {
    const whereConditions = prepareCondition(options)
    const deletedTag = await db.delete(tags).where(whereConditions)
    if (!deletedTag.rowsAffected) throw new Error('Tag not deleted')
    return deletedTag
  } catch (error) {
    logError(error, 'Tag Repository - deleteTag')
    throw error
  }
}

export default {
  getTag,
  createTag,
  updateTag,
  activateTag,
  deactivateTag,
  deleteTag,
}
