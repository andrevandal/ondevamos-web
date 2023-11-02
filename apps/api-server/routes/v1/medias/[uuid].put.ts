import { z } from 'zod'
import { eq, sql } from 'drizzle-orm'
import {
  validateBody,
  validateParams,
} from '../../../services/schemaValidation'
import { useAuth } from '../../../services/auth'
import { db } from '../../../services/database'
import { medias } from '../../../schemas/db/medias'

const bodySchema = z.object({
  type: z.enum(['image', 'video']).optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  alternativeText: z.string().optional(),
  active: z.boolean().optional(),
  status: z.enum(['pending', 'completed', 'error']).optional(),
})

type BodySchema = z.infer<typeof bodySchema>

const paramsSchema = z.object({
  uuid: z.string().regex(/^[0-9A-Za-z_]{12}$/, { message: 'Invalid UUID' }),
})
type ParamsSchema = z.infer<typeof paramsSchema>

export default defineEventHandler(async (event) => {
  useAuth(event)

  const { uuid } = await validateParams<ParamsSchema>(event, paramsSchema)

  const data = await validateBody<BodySchema>(event, bodySchema)

  if (!Object.keys(data).length) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Body is empty',
      data: { uuid },
      stack: undefined,
    })
  }

  const selectedMedia = await db
    .select()
    .from(medias)
    .where(eq(medias.uuid, uuid))
    .limit(1)

  if (!selectedMedia.length) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Media not found',
      data: { uuid },
      stack: undefined,
    })
  }

  const [newMedia] = await db
    .update(medias)
    .set({
      ...data,
      updatedAt: sql`now()`,
    })
    .where(eq(medias.uuid, uuid))

  if (!newMedia.affectedRows) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Failed to update media',
      data: { uuid },
      stack: undefined,
    })
  }

  const currentMedia = await db
    .select({
      uuid: medias.uuid,
      type: medias.type,
      title: medias.title,
      description: medias.description,
      alternativeText: medias.alternativeText,
      url: medias.url,
      active: medias.active,
      status: medias.status,
    })
    .from(medias)
    .where(eq(medias.uuid, uuid))
    .limit(1)

  return currentMedia
})
