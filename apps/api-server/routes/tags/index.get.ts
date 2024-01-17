import { db } from '@/services/database'

export default defineEventHandler(async () => {
  const selectedTags = await db.query.TagsTable.findMany({
    where: (tags, { eq }) => eq(tags.active, true),
  })

  return selectedTags
})
