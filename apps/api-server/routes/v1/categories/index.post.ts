import { useAuth } from '@/services/auth'
import { db } from '@/services'
import { createCategorySchema } from '@/schemas/endpoints'

import { CategoriesTable } from '@/schemas/db'
export default defineEventHandler(async (event) => {
  useAuth(event)

  const body = await readValidatedBody(event, createCategorySchema.parse)

  const newCategory = {
    slug: body.slug,
    name: body.name,
    label: body.label,
    description: body.description,
    icon: {
      name: body.iconName,
      pack: body.iconClassName,
    },
  }

  const [category] = await db
    .insert(CategoriesTable)
    .values(newCategory)
    .returning()

  return category
})
