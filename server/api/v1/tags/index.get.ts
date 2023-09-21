import { useAuth } from '@/server/services/auth'
import { getTags } from '@/server/repositories/tags'
// import { getAttractionFormated } from '@/server/repositories/attractions'

export default defineEventHandler(async (event) => {
  useAuth(event)

  const tags = await getTags()

  return tags
})
