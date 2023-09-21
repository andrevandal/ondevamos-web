import { useAuth } from '@/server/services/auth'
import {
  validateParams,
  validateBody,
} from '@/server/services/schemaValidation'
import {
  type UpdateAttractionsSchema,
  updateAttractionsSchema,
  type ParamsUUIDSchema,
  paramsUUIDSchema,
} from '@/server/schemas/endpoints'
import {
  updateAttraction,
  UpdateAttraction,
} from '@/server/repositories/attractions'
import { getPlaceId } from '@/server/repositories/places'
import { getMediaId } from '@/server/repositories/medias'

export default defineEventHandler(async (event) => {
  useAuth(event)

  const { uuid } = await validateParams<ParamsUUIDSchema>(
    event,
    paramsUUIDSchema,
  )

  const body = await validateBody<UpdateAttractionsSchema>(
    event,
    updateAttractionsSchema,
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
