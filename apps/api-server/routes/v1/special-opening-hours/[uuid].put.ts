import { useAuth } from '../../../services/auth'
import {
  validateParams,
  validateBody,
} from '../../../services/schemaValidation'
import {
  type ParamsUUIDSchema,
  paramsUUIDSchema,
} from '../../../schemas/endpoints'
import {
  type UpdateSpecialOpeningHours,
  updateSpecialOpeningHoursSchema,
} from '../../../schemas/endpoints/openingHours'

import { updateSpecialOpeningHours } from '../../../repositories/places'

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
