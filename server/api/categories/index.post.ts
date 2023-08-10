import { z } from 'zod'
import { zh } from 'h3-zod'

import { createCategory, NewCategory } from '@/server/repositories/categories'

const CategorySchema = z.object({
  slug: z.string(),
  description: z.string(),
  name: z.string(),
  active: z.boolean().optional(),
}) satisfies z.ZodType<NewCategory>

export default defineEventHandler(async (event) => {
  const body = await zh.useSafeValidatedBody(event, CategorySchema)
  if (!body.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid request body',
      data: body.error,
      stack: undefined,
    })
  }

  const category = await createCategory({
    slug: body.data.slug,
    description: body.data.description,
    name: body.data.name,
    active: body.data.active,
  })

  return { ...category }
})
