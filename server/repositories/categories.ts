import { consola } from 'consola'
import { eq, InferModel } from 'drizzle-orm'
import { generateUuid } from '@/server/services/nanoid'
import { db } from '@/server/services/database'
import { categories } from '@/server/schemas/db/categories'

type Identifier = Partial<
  Pick<InferModel<typeof categories>, 'id' | 'uuid' | 'slug'>
>
export type NewCategory = Omit<
  InferModel<typeof categories, 'insert'>,
  'id' | 'uuid' | 'createdAt' | 'updateAt'
>
export type UpdateCategory = Partial<
  Pick<
    InferModel<typeof categories>,
    'slug' | 'description' | 'icon' | 'active'
  >
>

const logError = (error: unknown, context: string) => {
  consola.error(
    `[${context}] ${error instanceof Error ? error.message : error}`,
  )
}

const prepareCondition = (options: Identifier) => {
  const { id, uuid, slug } = options

  if (id) return eq(categories.id, id)
  if (uuid) return eq(categories.uuid, uuid)
  if (slug) return eq(categories.slug, slug)

  throw new Error('No category identifier provided')
}

export const getCategory = async (options: Identifier) => {
  try {
    const whereConditions = prepareCondition(options)
    const [categoryData] = await db
      .select()
      .from(categories)
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
    const uuid = generateUuid()
    const newCategory = await db
      .insert(categories)
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
      .update(categories)
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
    const deletedCategory = await db.delete(categories).where(whereConditions)
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
