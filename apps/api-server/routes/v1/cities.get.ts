import { db } from '../../services/database'
import { cities as CitiesTable } from '../../schemas/db/places'
import { useAuth } from '../../services/auth'

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
