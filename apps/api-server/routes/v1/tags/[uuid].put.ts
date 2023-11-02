import { useAuth } from '../../../services/auth'
import {
  validateParams,
  validateBody,
} from '../../../services/schemaValidation'
import {
  updateTagSchema,
  UpdateTagSchema,
  paramsUUIDSlugSchema,
  ParamsUUIDSlugSchema,
} from '../../../schemas/endpoints'
import { updateTag } from '../../../repositories/tags'

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

  const updatedTag = await validateBody<UpdateTagSchema>(event, updateTagSchema)

  const tag = await updateTag(identifier, updatedTag)

  return tag
})