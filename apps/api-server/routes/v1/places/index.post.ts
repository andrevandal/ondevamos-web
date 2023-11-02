// import { consola } from 'consola'

import { createPlace } from '../../../repositories/places'

import { type CreatePlace, CreatePlaceSchema } from '../../../schemas/endpoints'
import { validateBody } from '../../../services/schemaValidation'
import { useAuth } from '../../../services/auth'

export default defineEventHandler(async (event) => {
  // const localLogger = consola.withTag('api/v1/places/index.post')

  useAuth(event)

  const body = await validateBody<CreatePlace>(event, CreatePlaceSchema)

  // localLogger.log('Place:', body)
  const place = await createPlace(body)
  return { ...place }
})
