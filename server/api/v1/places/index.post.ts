// import { consola } from 'consola'

import { createPlace } from '@/server/repositories/places'

import { type CreatePlace, CreatePlaceSchema } from '@/server/schemas/endpoints'
import { validateBody } from '@/server/services/schemaValidation'
import { useAuth } from '@/server/services/auth'

export default defineEventHandler(async (event) => {
  // const localLogger = consola.withTag('api/v1/places/index.post')

  useAuth(event)

  const body = await validateBody<CreatePlace>(event, CreatePlaceSchema)

  // localLogger.log('Place:', body)
  const place = await createPlace(body)
  return { ...place }
})
