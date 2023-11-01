import { consola } from 'consola'
import { or, eq, InferSelectModel, InferInsertModel } from 'drizzle-orm'
import { generateUuid } from '@/server/services/nanoid'
import { db } from '@/server/services/database'
import {
  categories as CategoriesTable,
  type Icon,
} from '@/server/schemas/db/categories'
import { parseMysqlInsertStatement } from '@/server/utils/helpers'
import { UpdateCategorySchema } from '@/server/schemas/endpoints'

type SelectCategory = InferSelectModel<typeof CategoriesTable>
type InsertCategory = InferInsertModel<typeof CategoriesTable>

type Identifier = Pick<SelectCategory, 'id' | 'uuid' | 'slug'>

export type NewCategory = Omit<
  InsertCategory,
  'id' | 'uuid' | 'createdAt' | 'updatedAt' | 'active'
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
  const { id, uuid, slug } = options

  if (id) return eq(CategoriesTable.id, id)
  if (uuid) return eq(CategoriesTable.uuid, uuid)
  if (slug) return eq(CategoriesTable.slug, slug)

  throw new Error('No category identifier provided')
}

export const getCategories = async () => {
  try {
    const categoriesData = await db.select().from(CategoriesTable)

    return categoriesData
  } catch (error) {
    logError(error, 'Category Repository - getCategory')
    throw error
  }
}

export const getCategoriesByKeys = async (
  keys: Identifier['slug'][] | Identifier['uuid'][],
) => {
  try {
    consola.info(
      keys,
      db
        .select()
        .from(CategoriesTable)
        .where(
          or(
            ...keys.map((key) =>
              or(eq(CategoriesTable.uuid, key), eq(CategoriesTable.slug, key)),
            ),
          ),
        )
        .toSQL(),
    )
    const categoriesData = await db
      .select()
      .from(CategoriesTable)
      .where(
        or(
          ...keys.map((key) =>
            or(eq(CategoriesTable.uuid, key), eq(CategoriesTable.slug, key)),
          ),
        ),
      )
    consola.info(categoriesData)
    return categoriesData
  } catch (error) {
    logError(error, 'Category Repository - getCategoriesByKeys')
    throw error
  }
}

export const getCategory = async (options: Partial<Identifier>) => {
  try {
    const whereConditions = prepareCondition(options)
    const [categoryData] = await db
      .select()
      .from(CategoriesTable)
      .where(whereConditions)
      .limit(1)

    if (categoryData?.id === undefined) throw new Error('Category not found')

    return categoryData
  } catch (error) {
    logError(error, 'Category Repository - getCategory')
    throw error
  }
}

export const createCategory = async (data: NewCategory) => {
  try {
    const uuid = generateUuid()
    const [newCategory] = await db
      .insert(CategoriesTable)
      .values({ ...data, uuid, active: false })

    if (!newCategory.insertId) throw new Error('Category not created')

    const parsedStatement = parseMysqlInsertStatement('')

    if (!parsedStatement) {
      return {}
    }

    return parsedStatement[0]
  } catch (error) {
    const { message } = error as Error
    logError(error, 'Category Repository - createCategory')

    if (message.includes('code = AlreadyExists')) {
      throw createError({
        statusCode: 400,
        statusMessage: 'You cannot create a category with this slug',
        data: undefined,
        stack: undefined,
      })
    }
    throw error
  }
}

export const updateCategory = async (
  options: Partial<Identifier>,
  data: UpdateCategorySchema,
) => {
  try {
    const whereConditions = prepareCondition(options)

    const updatedData = {
      ...(data?.name && { name: data.name }),
      ...(data?.label && { label: data.label }),
      ...(data?.description && { description: data.description }),
      ...((data.iconName || data.iconClasses) && {
        icon: {
          ...(data.iconName && { name: data.iconName }),
          ...(data.iconClasses && { className: data.iconClasses }),
        } as Icon,
      }),
      ...data,
    }

    const [updatedCategory] = await db
      .update(CategoriesTable)
      .set(updatedData)
      .where(whereConditions)

    if (!updatedCategory.affectedRows) throw new Error('Category not updated')
    return updatedData
  } catch (error) {
    logError(error, 'Category Repository - updateCategory')
    throw error
  }
}

export const activateCategory = (options: Partial<Identifier>) =>
  updateCategory(options, { active: true })

export const deactivateCategory = (options: Partial<Identifier>) =>
  updateCategory(options, { active: false })

export default {
  getCategory,
  createCategory,
  updateCategory,
  activateCategory,
  deactivateCategory,
}
