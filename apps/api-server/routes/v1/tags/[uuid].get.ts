import { useAuth } from '@/services/auth'
import { db } from '@/services'

export default defineEventHandler(async (event) => {
  useAuth(event)

  const uuid = getRouterParam(event, 'uuid')

  const tag = await db.query.TagsTable.findFirst({
    where: (TagsTable, { eq, or }) =>
      or(eq(TagsTable.id, uuid), eq(TagsTable.slug, uuid)),
  }).execute()

  return tag
})
