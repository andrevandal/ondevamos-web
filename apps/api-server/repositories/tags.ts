import { shake } from 'radash'
import { consola } from 'consola'
import { eq, InferSelectModel, InferInsertModel, or } from 'drizzle-orm'
import { db } from '@/services/database'
import { TagsTable, type Icon } from '@/schemas/db/index'

type SelectTag = InferSelectModel<typeof TagsTable>
type InsertTag = InferInsertModel<typeof TagsTable>

type Identifier = Pick<SelectTag, 'id' | 'slug'>

export type NewTag = Omit<InsertTag, 'id' | 'createdAt' | 'updatedAt'>
export type UpdateTag = Partial<
  Pick<SelectTag, 'slug' | 'description' | 'label' | 'active'>
>

const logError = (error: unknown, context: string) => {
  consola.error(
    `[${context}] ${error instanceof Error ? error.message : error}`,
  )
}

const prepareCondition = (options: Partial<Identifier>) => {
  const { id, slug } = options

  if (id) return eq(TagsTable.id, id)
  if (slug) return eq(TagsTable.slug, slug)

  throw createError({
    statusCode: 500,
    statusMessage: 'No tag identifier provided',
    data: undefined,
    stack: undefined,
  })
}

export const createTag = async (data: NewTag) => {
  try {
    const [tag] = await db.insert(TagsTable).values(data).returning()
    return tag
  } catch (error) {
    logError(error, 'Tag Repository - createTag')
    return null
  }
}

export const updateTag = async (
  options: Partial<Identifier>,
  data: UpdateTag,
) => {
  try {
    const whereConditions = prepareCondition(options)
    const values = shake(data)

    const [tag] = await db
      .update(TagsTable)
      .set(values)
      .where(whereConditions)
      .returning()

    return tag
  } catch (error) {
    logError(error, 'Tag Repository - updateTag')
    return null
  }
}

export const activateTag = (options: Partial<Identifier>) =>
  updateTag(options, { active: true })

export const deactivateTag = (options: Partial<Identifier>) =>
  updateTag(options, { active: false })

export default {
  createTag,
  updateTag,
  activateTag,
  deactivateTag,
}
