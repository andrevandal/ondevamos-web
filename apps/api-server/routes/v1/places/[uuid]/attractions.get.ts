import { z } from 'zod'
import { useAuth } from '../../../../services/auth'
import { validateParams } from '../../../../services/schemaValidation'
import { getAttractionsFromPlace } from '../../../../repositories/attractions'
import { getPlaceId } from '../../../../repositories/places'

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

  const placeId = await getPlaceId(identifier)

  const attractions = await getAttractionsFromPlace(placeId)

  return attractions
})