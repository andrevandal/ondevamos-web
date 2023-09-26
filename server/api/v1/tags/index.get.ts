import { useAuth } from '@/server/services/auth'
import { getTags } from '@/server/repositories/tags'
// import { getAttractionFormated } from '@/server/repositories/attractions'

export default defineEventHandler(async (event) => {
  useAuth(event)

  const tags = await getTags()

  return tags?.map((el) => ({
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
