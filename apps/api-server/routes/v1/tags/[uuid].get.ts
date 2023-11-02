import { useAuth } from '../../../services/auth'
import { validateParams } from '../../../services/schemaValidation'
import {
  paramsUUIDSlugSchema,
  type ParamsUUIDSlugSchema,
} from '../../../schemas/endpoints'
import { getTag } from '../../../repositories/tags'

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

  return {
    uuid: tag.uuid,
    slug: tag.slug,
    name: tag.name,
    label: tag.label,
    description: tag.description,
    iconName: tag.icon?.name,
    iconClasses: tag.icon?.className,
    active: tag.active,
    createdAt: tag.createdAt,
    updatedAt: tag.updatedAt,
  }
})
