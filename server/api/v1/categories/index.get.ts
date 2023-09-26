import { useAuth } from '@/server/services/auth'
import { getCategories } from '@/server/repositories/categories'
// import { getAttractionFormated } from '@/server/repositories/attractions'

export default defineEventHandler(async (event) => {
  useAuth(event)

  const categories = await getCategories()

  return categories.map((el) => ({
    uuid: el.uuid,
    slug: el.slug,
    name: el.name,
    label: el.label,
    description: el.description,
    iconName: el.icon?.name,
    iconClasses: el.icon?.className,
    active: el.active,
    createdAt: el.createdAt,
    updatedAt: el.updatedAt,
  }))
})
