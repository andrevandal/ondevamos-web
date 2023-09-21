import { useAuth } from '@/server/services/auth'
import { getCategories } from '@/server/repositories/categories'
// import { getAttractionFormated } from '@/server/repositories/attractions'

export default defineEventHandler(async (event) => {
  useAuth(event)

  const categories = await getCategories()

  return categories
})
