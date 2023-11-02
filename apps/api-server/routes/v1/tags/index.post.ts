import { useAuth } from '../../../services/auth'
import { validateBody } from '../../../services/schemaValidation'
import { createTagSchema, CreateTagSchema } from '../../../schemas/endpoints'
import { createTag } from '../../../repositories/tags'
// import { getPlaceId } from '../../../repositories/places'
// import { getMediaId } from '../../../repositories/medias'

export default defineEventHandler(async (event) => {
  useAuth(event)

  const body = await validateBody<CreateTagSchema>(event, createTagSchema)

  // return { success: true, message: 'ok', body }

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

  const newTag = {
    slug: body.slug,
    name: body.name,
    label: body.label,
    description: body.description,
    icon: {
      name: body.iconName,
      pack: body.iconClasses,
    },
  } as CreateTagSchema

  // if (placeId.value && placeId.status === 'fulfilled') {
  //   updatedAttraction.placeId = placeId.value
  // }

  // if (mediaId.value && mediaId.status === 'fulfilled') {
  //   updatedAttraction.mediaId = mediaId.value
  // }

  const tag = await createTag(newTag)

  // const attraction = await updateAttraction({ uuid }, updatedAttraction)

  return tag
})
