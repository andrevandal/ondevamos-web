import { eq } from 'drizzle-orm'
import { db } from '@/server/services/database'
import { tags } from '@/server/schemas/db/tags'

export default defineEventHandler(async () => {
  const selectedCategories = await db
    .select({
      uuid: tags.uuid,
      label: tags.label,
      slug: tags.slug,
      description: tags.description,
    })
    .from(tags)
    .where(eq(tags.active, true))

  return selectedCategories
})
