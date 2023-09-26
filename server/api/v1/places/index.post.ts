import { createPlace } from '@/server/repositories/places'

import { type CreatePlace, CreatePlaceSchema } from '@/server/schemas/endpoints'
import { validateBody } from '@/server/services/schemaValidation'
import { useAuth } from '@/server/services/auth'

export default defineEventHandler(async (event) => {
  useAuth(event)

  const body = await validateBody<CreatePlace>(event, CreatePlaceSchema)
  const place = await createPlace(body)
  return { ...place }
})
