import { shake } from 'radash';
import { z } from 'zod'
import { eq, sql } from 'drizzle-orm'
import { useAuth } from '@/services/auth'
import { db } from '@/services/database'
import { MediasTable } from '@/schemas/db'

const bodySchema = z.object({
  type: z.enum(['image', 'video']).optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  alternativeText: z.string().optional(),
  active: z.boolean().optional(),
  status: z.enum(['pending', 'completed', 'error']).optional(),
})

export default defineEventHandler(async (event) => {
  useAuth(event)

  const uuid = getRouterParam(event, 'uuid')

  const data = await readValidatedBody(event, bodySchema.parse)

  const [media] = await db
    .update(MediasTable)
    .set({
      ...shake(data),
      updatedAt: new Date().toISOString(),
    })
    .where(eq(MediasTable.id, uuid)).returning()

  if (!media) {
    throw createError({
      statusCode: 402,
      statusMessage: 'Failed to update media',
      data: { uuid },
      stack: undefined,
    })
  }
  
  return media
})
