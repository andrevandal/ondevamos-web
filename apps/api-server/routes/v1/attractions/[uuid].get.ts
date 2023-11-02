import { useAuth } from '../../../services/auth'
import { validateParams } from '../../../services/schemaValidation'
import { getAttractionFormated } from '../../../repositories/attractions'
import {
  type ParamsUUIDSchema,
  paramsUUIDSchema,
} from '../../../schemas/endpoints'

export default defineEventHandler(async (event) => {
  useAuth(event)

  const { uuid } = await validateParams<ParamsUUIDSchema>(
    event,
    paramsUUIDSchema,
  )
  const attraction = await getAttractionFormated({ uuid })

  if (!attraction) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Attraction not found',
      data: null,
      stack: undefined,
    })
  }

  return {
    uuid: attraction.uuid,
    title: attraction.title,
    description: attraction.description,
    featured: attraction.featured,
    order: attraction.order,
    active: attraction.active,
    mediaUuid: attraction.media?.uuid,
    mediaUrl: attraction.media?.url,
    place: attraction.place,
  }
})
