import { eq } from 'drizzle-orm'
import { db } from '@/server/services/database'
import { tags } from '@/server/schemas/db/tags'

export default defineEventHandler(async () => {
  const selectedTags = await db
    .select({
      uuid: tags.uuid,
      slug: tags.slug,
      name: tags.name,
      label: tags.label,
      description: tags.description,
      icon: tags.icon,
    })
    .from(tags)
    .where(eq(tags.active, true))

  return selectedTags
})
