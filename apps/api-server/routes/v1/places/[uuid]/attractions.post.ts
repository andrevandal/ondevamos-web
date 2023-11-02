import { z } from 'zod'
import { useAuth } from '../../../../services/auth'
import {
  validateParams,
  validateBody,
} from '../../../../services/schemaValidation'
import {
  type CreateAttractionSchema,
  createAttractionSchema,
} from '../../../../schemas/endpoints'
import {
  createAttraction,
  type NewAttraction,
} from '../../../../repositories/attractions'
import { getPlaceId } from '../../../../repositories/places'
import { getMediaId } from '../../../../repositories/medias'

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

  const body = await validateBody<CreateAttractionSchema>(
    event,
    createAttractionSchema,
  )

  const [placeId, mediaId] = await Promise.allSettled([
    getPlaceId(identifier),
    body.media !== undefined
      ? getMediaId({ uuid: body.media })
      : Promise.resolve(undefined),
  ])

  if (placeId.status !== 'fulfilled' || !placeId.value) {
    throw createError({
      statusCode: 404,
      message: 'Place not found',
    })
  }

  if (
    mediaId.status !== 'fulfilled' ||
    (body.media !== undefined && !mediaId.value)
  ) {
    throw createError({
      statusCode: 404,
      message: 'Media not found',
    })
  }

  const updatedAttraction = {
    title: body.title,
    description: body.description,
    featured: body.featured,
    order: body.order,
    placeId: placeId.value,
  } as NewAttraction

  if (mediaId.value && mediaId.status === 'fulfilled') {
    updatedAttraction.mediaId = mediaId.value
  }

  const attraction = await createAttraction(updatedAttraction)

  return attraction
})
