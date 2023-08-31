import { z } from 'zod'
import { zh } from 'h3-zod'

import { H3Event } from 'h3'
import { defineEventHandler } from '#imports'

import {
  updateCategory,
  UpdateCategory,
} from '@/server/repositories/categories'

const CategorySchema = z.object({
  slug: z.string().optional(),
  description: z.string().optional(),
  name: z.string().optional(),
  active: z.boolean().optional(),
}) satisfies z.ZodType<UpdateCategory>

export default defineEventHandler(async (event: H3Event) => {
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

  const body = await zh.useSafeValidatedBody(event, CategorySchema)
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
  ) as z.infer<typeof CategorySchema>

  const tag = await updateCategory(
    { id: params.data.id },
    {
      ...tagData,
    },
  )

  return { ...tag }
})
