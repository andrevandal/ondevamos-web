import { useAuth } from '@/server/services/auth'
import { validateParams } from '@/server/services/schemaValidation'
import {
  paramsUUIDSlugSchema,
  type ParamsUUIDSlugSchema,
} from '@/server/schemas/endpoints'
import { getTag } from '~/server/repositories/tags'

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

  const tag = await getTag(identifier)

  return tag
})
