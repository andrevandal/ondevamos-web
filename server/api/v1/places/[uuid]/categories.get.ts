import { z } from 'zod'
import consola from 'consola'
import { useAuth } from '@/server/services/auth'
import { validateParams } from '@/server/services/schemaValidation'
import { getPlaceCategories } from '@/server/repositories/places'

const logger = consola.withTag('api:places:categories:get')

const paramsSchema = z.object({
  uuid: z.string(),
})

type ParamsSchema = z.infer<typeof paramsSchema>

export default defineEventHandler(async (event) => {
  useAuth(event)

  const { uuid } = await validateParams<ParamsSchema>(event, paramsSchema)

  const isUuid = /^[0-9A-Za-z_]{12}$/.test(uuid)

  const identifier = isUuid
    ? ({ uuid } as { uuid: string })
    : ({ slug: uuid } as { slug: string })

  logger.log('identifier', identifier)

  const categories = await getPlaceCategories(identifier)

  return categories
})
