import { useAuth } from '@/services/auth'
import { updateCategorySchema } from '@/schemas/endpoints'
import { db } from '@/services'
import { CategoriesTable } from '@/schemas/db'
import { eq, or } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  useAuth(event)

  const uuid = getRouterParam(event, 'uuid')

  const body = await readValidatedBody(event, updateCategorySchema.parse)

  const category = await db
    .update(CategoriesTable)
    .set({
      name: body.name,
      label: body.label,
      description: body.description,
      icon: {
        name: body.name,
        className: body.iconClassName,
      },
      updatedAt: new Date().toISOString(),
    })
    .where(or(eq(CategoriesTable.id, uuid), eq(CategoriesTable.slug, uuid)))
    .returning()

  return category
})
