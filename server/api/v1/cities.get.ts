import { db } from '@/server/services/database'
import { cities as CitiesTable } from '@/server/schemas/db/places'
import { useAuth } from '@/server/services/auth'

export default defineEventHandler(async (event) => {
  useAuth(event)

  const cities = await db.select().from(CitiesTable).orderBy(CitiesTable.id)

  return cities.map((city) => ({
    uuid: city.uuid,
    ibgeCode: city.ibgeCode,
    name: city.name,
    state: city.state,
    country: city.country,
    label: city.label,
    createdAt: city.createdAt,
    updatedAt: city.updatedAt,
  }))
})
