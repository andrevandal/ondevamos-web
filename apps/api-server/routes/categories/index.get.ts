import { db } from '@/services/database'

export default defineEventHandler(async () => {
  const selectedCategories = await db.query.CategoriesTable.findMany({
    where: (categories, { eq }) => eq(categories.active, false),
  })

  return selectedCategories
})
