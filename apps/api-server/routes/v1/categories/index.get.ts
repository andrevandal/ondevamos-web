import { useAuth } from '@/services/auth'
import { db } from '@/services'

export default defineEventHandler(async (event) => {
  useAuth(event)

  const categories = await db.query.CategoriesTable.findMany({
    where: (CategoriesTable, { eq }) => eq(CategoriesTable.active, true),
    columns: {
      id: false,
      createdAt: false,
      updatedAt: false,
      active: false,
    },
    limit: 10,
    orderBy: (AttractionsTable, { asc }) => [asc(AttractionsTable.id)],
  })

  return categories.map((el) => ({
    slug: el.slug,
    name: el.name,
    label: el.label,
    description: el.description,
    iconName: el.icon?.name,
    iconClassName: el.icon?.className,
  }))
})
