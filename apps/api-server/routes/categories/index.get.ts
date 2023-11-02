import { eq } from 'drizzle-orm'
import { db } from '../../services/database'
import { categories } from '../../schemas/db/categories'

export default defineEventHandler(async () => {
  const selectedCategories = await db
    .select({
      uuid: categories.uuid,
      slug: categories.slug,
      name: categories.name,
      label: categories.label,
      description: categories.description,
      icon: categories.icon,
    })
    .from(categories)
    .where(eq(categories.active, true))

  return selectedCategories
})