import { z } from 'zod'
import { useAuth } from '@/services/auth'
import { validateParams } from '@/services/schemaValidation'
import { getPlaceByExternalId } from '@/repositories/places'

const paramsSchema = z.object({
  uuid: z.string(),
})

type ParamsSchema = z.infer<typeof paramsSchema>

export default defineEventHandler(async (event) => {
  useAuth(event)

  const { uuid } = await validateParams<ParamsSchema>(event, paramsSchema)

  const place = await getPlaceByExternalId(uuid)

  return place
})
