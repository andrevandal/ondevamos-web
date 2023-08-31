import { db } from '@/server/services/database'
import { cities } from '@/server/schemas/db/places'

export default defineEventHandler(async () => {
  const result = await db.select().from(cities).orderBy(cities.id)

  return result
})
