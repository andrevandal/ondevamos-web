import { useAuth } from '@/server/services/auth'
import {
  validateParams,
  validateBody,
} from '@/server/services/schemaValidation'
import {
  updateCategorySchema,
  type UpdateCategorySchema,
  type ParamsUUIDSlugSchema,
  paramsUUIDSlugSchema,
} from '@/server/schemas/endpoints'
import { updateCategory } from '@/server/repositories/categories'

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

  const updatedCategory = await validateBody<UpdateCategorySchema>(
    event,
    updateCategorySchema,
  )

  const category = await updateCategory(identifier, updatedCategory)

  return category
})
