import { z } from 'zod'
import { zh } from 'h3-zod'

import { UpdateTag, updateTag } from '@/server/repositories/tags'

const TagSchema = z.object({
  slug: z.string().optional(),
  description: z.string().optional(),
  label: z.string().optional(),
  active: z.boolean().optional(),
}) satisfies z.ZodType<UpdateTag>

export default defineEventHandler(async (event) => {
  const params = await zh.useSafeValidatedParams(
    event,
    z.object({
      id: z.coerce.number(),
    }),
  )

  if (!params.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid request params',
      data: params.error,
      stack: undefined,
    })
  }

  const body = await zh.useSafeValidatedBody(event, TagSchema)
  if (!body.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid request body',
      data: body.error,
      stack: undefined,
    })
  }

  const tagData = Object.fromEntries(
    Object.entries(body.data).filter(([_key, value]) => value !== undefined),
  ) as z.infer<typeof TagSchema>

  const tag = await updateTag(
    { id: params.data.id },
    {
      ...tagData,
    },
  )

  return { ...tag }
})
