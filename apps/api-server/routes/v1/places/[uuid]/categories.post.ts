import { z } from 'zod'
import { useAuth } from '../../../../services/auth'
import {
  validateParams,
  validateBody,
} from '../../../../services/schemaValidation'
import {
  type UpdatePlaceCategories,
  UpdatePlaceCategoriesSchema,
} from '../../../../schemas/endpoints'
import { updatePlaceCategories } from '../../../../repositories/places'

const ParamsSchema = z.object({
  uuid: z.string(),
})

type Params = z.infer<typeof ParamsSchema>

export default defineEventHandler(async (event) => {
  useAuth(event)

  const { uuid } = await validateParams<Params>(event, ParamsSchema)

  const isUuid = /^[0-9A-Za-z_]{12}$/.test(uuid)

  const identifier = isUuid
    ? ({ uuid } as { uuid: string })
    : ({ slug: uuid } as { slug: string })

  const body = await validateBody<UpdatePlaceCategories>(
    event,
    UpdatePlaceCategoriesSchema,
  )

  const place = await updatePlaceCategories(identifier, body)

  return place
})
