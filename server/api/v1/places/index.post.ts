import { createPlace } from '@/server/repositories/places'

import { type CreatePlace, CreatePlaceSchema } from '@/server/schemas/endpoints'
import { validateBody } from '@/server/services/schemaValidation'

export default defineEventHandler(async (event) => {
  const body = await validateBody<CreatePlace>(event, CreatePlaceSchema)
  const place = await createPlace(body)
  return { ...place }
})
