import { useAuth } from '@/server/services/auth'
import {
  validateParams,
  validateBody,
} from '@/server/services/schemaValidation'

import {
  type ParamsUUIDSlugSchema,
  paramsUUIDSlugSchema,
} from '@/server/schemas/endpoints'
import {
  createOpeningHoursSchema,
  type CreateOpeningHours,
} from '@/server/schemas/endpoints/openingHours'
import { createPlaceOpeningHours } from '@/server/repositories/places'

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

  const body = await validateBody<CreateOpeningHours>(
    event,
    createOpeningHoursSchema,
  )

  const openingHours = await createPlaceOpeningHours(identifier, body)

  return openingHours
})
