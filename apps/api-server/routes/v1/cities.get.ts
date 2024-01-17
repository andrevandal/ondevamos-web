import { db } from '@/services/database'
import { useAuth } from '@/services/auth'

export default defineEventHandler(async (event) => {
  useAuth(event)

  const cities = await db.query.CitiesTable.findMany({
    limit: 10
  })

  return cities
})
