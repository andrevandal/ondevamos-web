// import { consola } from 'consola'

import { createPlace } from '@/repositories/places'

import { type CreatePlace, CreatePlaceSchema } from '@/schemas/endpoints'
import { useAuth } from '@/services/auth'

export default defineEventHandler(async (event) => {
  useAuth(event)

  const body = await validateBody<CreatePlace>(event, CreatePlaceSchema)
  const place = await createPlace(body)
  return { ...place }
})
