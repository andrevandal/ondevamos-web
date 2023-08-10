import { eq } from 'drizzle-orm'
import { db } from '@/server/services/database'
import { categories } from '@/server/schemas/db/categories'

export default defineEventHandler(async () => {
  const selectedCategories = await db
    .select({
      uuid: categories.uuid,
      name: categories.name,
      slug: categories.slug,
      description: categories.description,
      icon: categories.icon,
    })
    .from(categories)
    .where(eq(categories.active, true))

  return selectedCategories
})
