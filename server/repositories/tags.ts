import { consola } from 'consola'
import { eq, InferSelectModel, InferInsertModel, or } from 'drizzle-orm'
import { generateUuid } from '@/server/services/nanoid'
import { db } from '@/server/services/database'
import { tags as TagsTable } from '@/server/schemas/db/tags'
// import {categories as CategoriesTable} from '@/server/schemas/db/categories';

type SelectTag = InferSelectModel<typeof TagsTable>
type InsertTag = InferInsertModel<typeof TagsTable>

type Identifier = Pick<SelectTag, 'id' | 'uuid' | 'slug'>

export type NewTag = Omit<InsertTag, 'id' | 'uuid' | 'createdAt' | 'updatedAt'>
export type UpdateTag = Partial<
  Pick<SelectTag, 'slug' | 'description' | 'label' | 'active'>
>

const logError = (error: unknown, context: string) => {
  consola.error(
    `[${context}] ${error instanceof Error ? error.message : error}`,
  )
}

const prepareCondition = (options: Partial<Identifier>) => {
  const { id, uuid, slug } = options

  if (id) return eq(TagsTable.id, id)
  if (uuid) return eq(TagsTable.uuid, uuid)
  if (slug) return eq(TagsTable.slug, slug)

  throw new Error('No tag identifier provided')
}

export const getTags = async () => {
  try {
    const tagsData = await db.select().from(TagsTable)

    return tagsData
  } catch (error) {
    logError(error, 'Tag Repository - getTags')
    throw error
  }
}

export const getTagsByKeys = async (
  keys: Identifier['slug'][] | Identifier['uuid'][],
) => {
  try {
    const tagsData = await db
      .select()
      .from(TagsTable)
      .where(
        or(
          ...keys.map((key) =>
            or(eq(TagsTable.uuid, key), eq(TagsTable.slug, key)),
          ),
        ),
      )

    return tagsData
  } catch (error) {
    logError(error, 'Tag Repository - getTagsByKeys')
    throw error
  }
}

export const getTag = async (options: Partial<Identifier>) => {
  try {
    const whereConditions = prepareCondition(options)
    const [tagData] = await db
      .select()
      .from(TagsTable)
      .where(whereConditions)
      .limit(1)

    if (tagData?.id === undefined) throw new Error('Tag not found')
    return tagData
  } catch (error) {
    logError(error, 'Tag Repository - getTag')
    throw error
  }
}

export const createTag = async (data: NewTag) => {
  try {
    const uuid = generateUuid()

    const newTag = await db
      .insert(TagsTable)
      .values({ active: false, ...data, uuid })

    if (!newTag.insertId) throw new Error('Tag not created')
    return newTag
  } catch (error) {
    const { message } = error as Error
    logError(error, 'Tag Repository - createTag')

    if (message.includes('code = AlreadyExists')) {
      throw createError({
        statusCode: 400,
        statusMessage: 'You cannot create a tag with this slug',
        data: undefined,
        stack: undefined,
      })
    }
    throw error
  }
}

export const updateTag = async (
  options: Partial<Identifier>,
  data: UpdateTag,
) => {
  try {
    const whereConditions = prepareCondition(options)

    const updatedData = {
      ...data,
      updatedAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
    }

    const updatedTag = await db
      .update(TagsTable)
      .set(updatedData)
      .where(whereConditions)

    if (!updatedTag.rowsAffected) throw new Error('Tag not updated')
    return updatedData
  } catch (error) {
    logError(error, 'Tag Repository - updateTag')
    throw error
  }
}

export const activateTag = (options: Partial<Identifier>) =>
  updateTag(options, { active: true })

export const deactivateTag = (options: Partial<Identifier>) =>
  updateTag(options, { active: false })

export default {
  getTag,
  createTag,
  updateTag,
  activateTag,
  deactivateTag,
}
