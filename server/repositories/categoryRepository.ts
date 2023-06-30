import { consola } from 'consola'
import { eq, InferModel } from 'drizzle-orm'
import { nanoid } from '@/server/services/uuid'
import { db } from '@/server/services/database'
import { category } from '@/server/schemas/database'

type Identifier = Partial<
  Pick<InferModel<typeof category>, 'id' | 'uuid' | 'slug'>
>
type NewCategory = Omit<
  InferModel<typeof category, 'insert'>,
  'id' | 'uuid' | 'createdAt' | 'updateAt'
>
type UpdateCategory = Partial<
  Pick<
    InferModel<typeof category>,
    'slug' | 'description' | 'iconName' | 'active'
  >
>

const logError = (error: unknown, context: string) => {
  consola.error(
    `[${context}] ${error instanceof Error ? error.message : error}`,
  )
}

const prepareCondition = (options: Identifier) => {
  const { id, uuid, slug } = options

  if (id) return eq(category.id, id)
  if (uuid) return eq(category.uuid, uuid)
  if (slug) return eq(category.slug, slug)

  throw new Error('No category identifier provided')
}

export const getCategory = async (options: Identifier) => {
  try {
    const whereConditions = prepareCondition(options)
    const [categoryData] = await db
      .select()
      .from(category)
      .where(whereConditions)
      .limit(1)
    return categoryData
  } catch (error) {
    logError(error, 'Category Repository - getCategory')
    throw error
  }
}

export const createCategory = async (data: NewCategory) => {
  try {
    if (await getCategory({ slug: data.slug }))
      throw new Error('Category already exists')
    const uuid = nanoid()
    const newCategory = await db
      .insert(category)
      .values({ ...data, uuid, active: false })

    if (!newCategory.insertId) throw new Error('Category not created')
    return newCategory
  } catch (error) {
    logError(error, 'Category Repository - createCategory')
    throw error
  }
}

export const updateCategory = async (
  options: Identifier,
  data: UpdateCategory,
) => {
  try {
    const whereConditions = prepareCondition(options)
    const updatedCategory = await db
      .update(category)
      .set(data)
      .where(whereConditions)

    if (!updatedCategory.rowsAffected) throw new Error('Category not updated')
    return updatedCategory
  } catch (error) {
    logError(error, 'Category Repository - updateCategory')
    throw error
  }
}

export const activateCategory = (options: Identifier) =>
  updateCategory(options, { active: true })

export const deactivateCategory = (options: Identifier) =>
  updateCategory(options, { active: false })

export const deleteCategory = async (options: Identifier) => {
  try {
    const whereConditions = prepareCondition(options)
    const deletedCategory = await db.delete(category).where(whereConditions)
    if (!deletedCategory.rowsAffected) throw new Error('Category not deleted')
    return deletedCategory
  } catch (error) {
    logError(error, 'Category Repository - deleteCategory')
    throw error
  }
}

export default {
  getCategory,
  createCategory,
  updateCategory,
  activateCategory,
  deactivateCategory,
  deleteCategory,
}
