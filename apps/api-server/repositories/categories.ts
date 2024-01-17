import { shake } from 'radash'
import { consola } from 'consola'
import { or, eq, InferSelectModel, InferInsertModel } from 'drizzle-orm'
import { db } from '@/services/database'
import { CategoriesTable, type Icon } from '@/schemas/db/index'

type SelectCategory = InferSelectModel<typeof CategoriesTable>
type InsertCategory = InferInsertModel<typeof CategoriesTable>

type Identifier = Pick<SelectCategory, 'id' | 'slug'>

export type NewCategory = Omit<
  InsertCategory,
  'id' | 'createdAt' | 'updatedAt' | 'active'
>
export type UpdateCategory = Partial<
  Pick<SelectCategory, 'name' | 'label' | 'description' | 'icon' | 'active'>
>

const logError = (error: unknown, context: string) => {
  consola.error(
    `[${context}] ${error instanceof Error ? error.message : error}`,
  )
}

const prepareCondition = (options: Partial<Identifier>) => {
  const { id, slug } = options

  if (id) return eq(CategoriesTable.id, id)
  if (slug) return eq(CategoriesTable.slug, slug)

  throw createError({
    statusCode: 500,
    statusMessage: 'No category identifier provided',
    data: undefined,
    stack: undefined,
  })
}

export const createCategory = async (data: NewCategory) => {
  try {
    const [newCategory] = await db
      .insert(CategoriesTable)
      .values({ ...data, active: false })
      .returning()

    return newCategory
  } catch (error) {
    logError(error, 'Category Repository - createCategory')
    return null
  }
}

export const updateCategory = async (
  options: Partial<Identifier>,
  data: UpdateCategory,
) => {
  try {
    const whereConditions = prepareCondition(options)

    const values = shake(data)

    const category = await db
      .update(CategoriesTable)
      .set(values)
      .where(whereConditions)
      .returning()
    return category
  } catch (error) {
    logError(error, 'Category Repository - updateCategory')
    return null
  }
}

export const activateCategory = (options: Partial<Identifier>) =>
  updateCategory(options, { active: true })

export const deactivateCategory = (options: Partial<Identifier>) =>
  updateCategory(options, { active: false })

export default {
  createCategory,
  updateCategory,
  activateCategory,
  deactivateCategory,
}
