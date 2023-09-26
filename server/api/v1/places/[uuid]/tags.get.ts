import { z } from 'zod'
import { useAuth } from '@/server/services/auth'
import { validateParams } from '@/server/services/schemaValidation'
import { getPlaceTags } from '@/server/repositories/places'

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

  const tags = await getPlaceTags(identifier)

  return tags
})
