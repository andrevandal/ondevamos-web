import { useAuth } from '../../../../services/auth'
import {
  validateBody,
  validateParams,
} from '../../../../services/schemaValidation'
import {
  type ParamsUUIDSlugSchema,
  paramsUUIDSlugSchema,
} from '../../../../schemas/endpoints'
import {
  type CreateSpecialOpeningHours,
  createSpecialOpeningHoursSchema,
} from '../../../../schemas/endpoints/openingHours'
import { createPlaceSpecialOpeningHours } from '../../../../repositories/places'

export default defineEventHandler(async (event) => {
  useAuth(event)

  const { uuid } = await validateParams<ParamsUUIDSlugSchema>(
    event,
    paramsUUIDSlugSchema,
  )

  const isUuid = /^[0-9A-Za-z_]{12}$/.test(uuid)

  const identifier = isUuid
    ? ({ uuid } as { uuid: string })
    : ({ slug: uuid } as { slug: string })

  const body = await validateBody<CreateSpecialOpeningHours>(
    event,
    createSpecialOpeningHoursSchema,
  )

  const specialOpeningHours = await createPlaceSpecialOpeningHours(
    identifier,
    body,
  )

  return specialOpeningHours
})
