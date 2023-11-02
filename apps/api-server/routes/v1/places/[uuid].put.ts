import { z } from 'zod'

import { useAuth } from '../../../services/auth'

import { type UpdatePlace, UpdatePlaceSchema } from '../../../schemas/endpoints'
import {
  validateBody,
  validateParams,
} from '../../../services/schemaValidation'
import { updatePlace } from '../../../repositories/places'

const paramsSchema = z.object({
  uuid: z.string(),
})

type ParamsSchema = z.infer<typeof paramsSchema>

export default defineEventHandler(async (event) => {
  useAuth(event)

  const { uuid } = await validateParams<ParamsSchema>(event, paramsSchema)

  const isUuid = /^[0-9A-Za-z_]{12}$/.test(uuid)

  const identifier = isUuid
    ? ({ uuid } as { uuid: string })
    : ({ slug: uuid } as { slug: string })

  const body = await validateBody<UpdatePlace>(event, UpdatePlaceSchema)

  console.debug('body', body)

  const place = await updatePlace(identifier, body)
  return place
})
