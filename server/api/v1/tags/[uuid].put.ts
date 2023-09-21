import { useAuth } from '@/server/services/auth'
import {
  validateParams,
  validateBody,
} from '@/server/services/schemaValidation'
import {
  updateTagSchema,
  UpdateTagSchema,
  paramsUUIDSlugSchema,
  ParamsUUIDSlugSchema,
} from '@/server/schemas/endpoints'
import { updateTag } from '@/server/repositories/tags'
// import { getPlaceId } from '@/server/repositories/places'
// import { getMediaId } from '@/server/repositories/medias'

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

  const body = await validateBody<UpdateTagSchema>(event, updateTagSchema)

  // return { success: true, message: 'ok', params: identifier, body }

  // const [placeId, mediaId] = await Promise.allSettled([
  //   body.place !== undefined
  //     ? getPlaceId({ uuid: body.place })
  //     : Promise.resolve(undefined),
  //   body.media !== undefined
  //     ? getMediaId({ uuid: body.media })
  //     : Promise.resolve(undefined),
  // ])

  // if (placeId.status !== 'fulfilled' || mediaId.status !== 'fulfilled') {
  //   throw createError({
  //     statusCode: 404,
  //     message: 'Place or media not found',
  //   })
  // }

  const updatedTag = {
    name: body.name,
    label: body.label,
    description: body.description,
    icon: {
      name: body.iconName,
      pack: body.iconClasses,
    },
  } as UpdateTagSchema

  // if (placeId.value && placeId.status === 'fulfilled') {
  //   updatedAttraction.placeId = placeId.value
  // }

  // if (mediaId.value && mediaId.status === 'fulfilled') {
  //   updatedAttraction.mediaId = mediaId.value
  // }

  const tag = await updateTag(identifier, updatedTag)

  return tag

  // const attraction = await updateAttraction({ uuid }, updatedAttraction)

  // return attraction
})
