import { db } from '@/server/services/database'
import { cities as CitiesTable } from '@/server/schemas/db/places'

export default defineEventHandler(async () => {
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
