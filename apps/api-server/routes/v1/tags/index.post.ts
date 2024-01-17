import { useAuth } from '@/services/auth'
import { createTagSchema } from '@/schemas/endpoints'
import { db } from '@/services'
import { TagsTable } from '@/schemas/db'

export default defineEventHandler(async (event) => {
  useAuth(event)

  const body = await readValidatedBody(event, createTagSchema.parse)

  const newTag = {
    slug: body.slug,
    name: body.name,
    label: body.label,
    description: body.description,
    icon: {
      name: body.iconName,
      pack: body.iconClassName,
    },
  }

  const [tag] = await db.insert(TagsTable).values(newTag).returning()

  return tag
})
