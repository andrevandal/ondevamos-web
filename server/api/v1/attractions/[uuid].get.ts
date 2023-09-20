import { z } from 'zod'
import { useAuth } from '@/server/services/auth'
import { validateParams } from '@/server/services/schemaValidation'
import { getAttractionFormated } from '@/server/repositories/attractions'

const paramsSchema = z.object({
  uuid: z.string().regex(/^[0-9A-Za-z_]{12}$/, { message: 'Invalid UUID' }),
})

type ParamsSchema = z.infer<typeof paramsSchema>

export default defineEventHandler(async (event) => {
  useAuth(event)

  const { uuid } = await validateParams<ParamsSchema>(event, paramsSchema)

  const attractions = await getAttractionFormated({ uuid })

  return attractions
})
