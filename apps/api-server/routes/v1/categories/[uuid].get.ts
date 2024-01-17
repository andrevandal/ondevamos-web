import { useAuth } from '@/services/auth'
import { db } from '@/services'

export default defineEventHandler(async (event) => {
  useAuth(event)

  const uuid = getRouterParam(event, 'uuid')

  const category = await db.query.CategoriesTable.findFirst({
    where: (CategoriesTable, { eq, or }) =>
      or(eq(CategoriesTable.id, uuid), eq(CategoriesTable.slug, uuid)),
  })

  return category
})
