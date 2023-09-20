import { z } from 'zod'
import { useAuth } from '@/server/services/auth'
import {
  validateParams,
  validateBody,
} from '@/server/services/schemaValidation'
import {
  UpdateAttractions,
  UpdateAttractionsSchema,
} from '@/server/schemas/endpoints'
import {
  updateAttraction,
  UpdateAttraction,
} from '@/server/repositories/attractions'
import { getPlaceId } from '@/server/repositories/places'
import { getMediaId } from '@/server/repositories/medias'

const paramsSchema = z.object({
  uuid: z.string().regex(/^[0-9A-Za-z_]{12}$/, { message: 'Invalid UUID' }),
})

type ParamsSchema = z.infer<typeof paramsSchema>

export default defineEventHandler(async (event) => {
  useAuth(event)

  const { uuid } = await validateParams<ParamsSchema>(event, paramsSchema)

  const body = await validateBody<UpdateAttractions>(
    event,
    UpdateAttractionsSchema,
  )

  const [placeId, mediaId] = await Promise.allSettled([
    body.place !== undefined
      ? getPlaceId({ uuid: body.place })
      : Promise.resolve(undefined),
    body.media !== undefined
      ? getMediaId({ uuid: body.media })
      : Promise.resolve(undefined),
  ])

  if (placeId.status !== 'fulfilled' || mediaId.status !== 'fulfilled') {
    throw createError({
      statusCode: 404,
      message: 'Place or media not found',
    })
  }

  const updatedAttraction = {
    title: body.title,
    description: body.description,
    featured: body.featured,
    order: body.order,
  } as UpdateAttraction

  if (placeId.value && placeId.status === 'fulfilled') {
    updatedAttraction.placeId = placeId.value
  }

  if (mediaId.value && mediaId.status === 'fulfilled') {
    updatedAttraction.mediaId = mediaId.value
  }

  const attraction = await updateAttraction({ uuid }, updatedAttraction)

  return attraction
})
