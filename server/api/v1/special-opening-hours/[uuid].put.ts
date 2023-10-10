import { useAuth } from '@/server/services/auth'
import {
  validateParams,
  validateBody,
} from '@/server/services/schemaValidation'
import {
  type ParamsUUIDSchema,
  paramsUUIDSchema,
} from '@/server/schemas/endpoints'
import {
  type UpdateSpecialOpeningHours,
  updateSpecialOpeningHoursSchema,
} from '@/server/schemas/endpoints/openingHours'

import { updateSpecialOpeningHours } from '@/server/repositories/places'

export default defineEventHandler(async (event) => {
  useAuth(event)

  const { uuid } = await validateParams<ParamsUUIDSchema>(
    event,
    paramsUUIDSchema,
  )

  const body = await validateBody<UpdateSpecialOpeningHours>(
    event,
    updateSpecialOpeningHoursSchema,
  )

  const specialOpeningHours = await updateSpecialOpeningHours(uuid, body)

  return specialOpeningHours
})
