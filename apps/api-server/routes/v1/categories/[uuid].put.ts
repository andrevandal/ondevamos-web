import { useAuth } from '../../../services/auth'
import {
  validateParams,
  validateBody,
} from '../../../services/schemaValidation'
import {
  updateCategorySchema,
  type UpdateCategorySchema,
  type ParamsUUIDSlugSchema,
  paramsUUIDSlugSchema,
} from '../../../schemas/endpoints'
import { updateCategory } from '../../../repositories/categories'

// import { getPlaceId } from '../../../repositories/places'
// import { getMediaId } from '../../../repositories/medias'

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
