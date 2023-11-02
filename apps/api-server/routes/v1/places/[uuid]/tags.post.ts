import { z } from 'zod'
import { useAuth } from '../../../../services/auth'
import {
  validateParams,
  validateBody,
} from '../../../../services/schemaValidation'
import {
  type UpdatePlaceTags,
  UpdatePlaceTagsSchema,
} from '../../../../schemas/endpoints'
import { updatePlaceTags } from '../../../../repositories/places'

const ParamsSchema = z.object({
  uuid: z.string(),
})

type Params = z.infer<typeof ParamsSchema>

export const BodySchema = z.array(z.string())

export type Body = z.infer<typeof BodySchema>

export default defineEventHandler(async (event) => {
  useAuth(event)

  const { uuid } = await validateParams<Params>(event, ParamsSchema)

  const isUuid = /^[0-9A-Za-z_]{12}$/.test(uuid)

  const identifier = isUuid
    ? ({ uuid } as { uuid: string })
    : ({ slug: uuid } as { slug: string })

  const body = await validateBody<UpdatePlaceTags>(event, UpdatePlaceTagsSchema)

  const tags = await updatePlaceTags(identifier, body)

  return tags
})
