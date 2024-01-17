import { db } from '@/services'
import { useAuth } from '@/services/auth'

export default defineEventHandler(async (event) => {
  useAuth(event)

  const tags = await db.query.TagsTable.findMany({
    limit: 10
  })

  return tags
})
