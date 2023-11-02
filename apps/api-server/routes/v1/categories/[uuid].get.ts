import { useAuth } from '../../../services/auth'
import { validateParams } from '../../../services/schemaValidation'
import {
  type ParamsUUIDSlugSchema,
  paramsUUIDSlugSchema,
} from '../../../schemas/endpoints'
import { getCategory } from '../../../repositories/categories'

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

  const category = await getCategory(identifier)

  return category
})
