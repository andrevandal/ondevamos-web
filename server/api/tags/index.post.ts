import { z } from 'zod'
import { zh } from 'h3-zod'

import { createTag, NewTag } from '@/server/repositories/tags'

const TagSchema = z.object({
  slug: z.string(),
  description: z.string(),
  label: z.string(),
  active: z.boolean().optional(),
}) satisfies z.ZodType<NewTag>

export default defineEventHandler(async (event) => {
  const body = await zh.useSafeValidatedBody(event, TagSchema)
  if (!body.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid request body',
      data: body.error,
      stack: undefined,
    })
  }

  const tag = await createTag({
    slug: body.data.slug,
    description: body.data.description,
    label: body.data.label,
    active: body.data.active,
  })

  return { ...tag }
})
