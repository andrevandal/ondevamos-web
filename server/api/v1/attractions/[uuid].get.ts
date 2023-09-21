import { useAuth } from '@/server/services/auth'
import { validateParams } from '@/server/services/schemaValidation'
import { getAttractionFormated } from '@/server/repositories/attractions'
import {
  type ParamsUUIDSchema,
  paramsUUIDSchema,
} from '@/server/schemas/endpoints'

export default defineEventHandler(async (event) => {
  useAuth(event)

  const { uuid } = await validateParams<ParamsUUIDSchema>(
    event,
    paramsUUIDSchema,
  )

  const attractions = await getAttractionFormated({ uuid })

  return attractions
})
