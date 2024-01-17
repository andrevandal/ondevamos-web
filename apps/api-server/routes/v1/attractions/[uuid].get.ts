import { useAuth } from '@/services/auth'
import { db } from '@/services/database'

export default defineEventHandler(async (event) => {
  useAuth(event)

  const uuid = getRouterParam(event, 'uuid')
  const attraction = await db.query.AttractionsTable.findFirst({
    where: (AttractionsTable, { eq }) => eq(AttractionsTable.id, uuid),
    columns: {
      createdAt: false,
      updatedAt: false,
    },
    with: {
      media: {
        columns: {
          id: true,
          alternativeText: true,
          url: true,
        }
      },
    },
  })

  if (!attraction) {
    return createError({
      statusCode: 404,
      statusMessage: 'Attraction not found',
      data: null,
      stack: undefined,
    })
  }

  return attraction
})
