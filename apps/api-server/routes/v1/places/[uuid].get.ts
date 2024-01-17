import { db } from '@/services'
import { useAuth } from '@/services/auth'


export default defineEventHandler(async (event) => {
  useAuth(event)

  const uuid = getRouterParam(event, 'uuid')

  const place = await db.query.PlacesTable.findFirst({
    where: (PlacesTable, { eq, or }) => or(eq(PlacesTable.id, uuid), eq(PlacesTable.slug, uuid)),
  })

  return place
})
