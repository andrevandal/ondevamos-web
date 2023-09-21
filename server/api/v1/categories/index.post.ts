import { useAuth } from '@/server/services/auth'
import { validateBody } from '@/server/services/schemaValidation'
import {
  createCategorySchema,
  type CreateCategorySchema,
} from '@/server/schemas/endpoints'
import { createCategory } from '@/server/repositories/categories'

// import { getPlaceId } from '@/server/repositories/places'
// import { getMediaId } from '@/server/repositories/medias'

export default defineEventHandler(async (event) => {
  useAuth(event)

  const body = await validateBody<CreateCategorySchema>(
    event,
    createCategorySchema,
  )

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

  const newCategory = {
    slug: body.slug,
    name: body.name,
    label: body.label,
    description: body.description,
    icon: {
      name: body.iconName,
      pack: body.iconClasses,
    },
  } as CreateCategorySchema

  const category = await createCategory(newCategory)

  return category

  // if (placeId.value && placeId.status === 'fulfilled') {
  //   updatedAttraction.placeId = placeId.value
  // }

  // if (mediaId.value && mediaId.status === 'fulfilled') {
  //   updatedAttraction.mediaId = mediaId.value
  // }

  // const attraction = await updateAttraction({ uuid }, updatedAttraction)

  // return attraction
})
