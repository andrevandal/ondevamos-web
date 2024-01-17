import { shake } from 'radash'
import { useAuth } from '@/services/auth'
import {
  updateAttractionsSchema,
} from '@/schemas/endpoints'
import { db } from '@/services'
import {
  AttractionsTable,
  MediasTable,
  PlacesTable,
  PlacesToMediasTable,
} from '@/schemas/db'
import { eq, type InferSelectModel, type InferInsertModel } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  useAuth(event)
  const uuid = getRouterParam(event, 'uuid')

  const body = await readValidatedBody(event, updateAttractionsSchema.parse)

  const [rawPlace, rawMedia] = await Promise.allSettled([
    body.place !== undefined
      ? db.query.PlacesTable.findFirst({
          where: (PlacesTable, { eq }) => eq(PlacesTable.id, body.place),
        })
      : Promise.resolve(undefined),
    body.media !== undefined
      ? db.query.MediasTable.findFirst({
          where: (MediasTable, { eq }) => eq(MediasTable.id, body.media),
        })
      : Promise.resolve(undefined),
  ])

  if (rawPlace.status !== 'fulfilled' || rawMedia.status !== 'fulfilled') {
    throw createError({
      statusCode: 404,
      message: 'Place or media not found',
    })
  }

  const place = (rawPlace?.value ?? {}) as unknown as Partial<
    InferSelectModel<typeof PlacesTable>
  >
  const media = (rawPlace?.value ?? {}) as unknown as Partial<
    InferSelectModel<typeof MediasTable>
  >

  const updatedAttraction = {
    ...shake({
      title: body.title,
      description: body?.description,
      featured: body?.featured,
      order: body?.order,
    }),
    placeId: place?.id,
    mediaId: media?.id,
    updatedAt: new Date().toISOString(),
  }

  const [attraction] = await db
    .update(AttractionsTable)
    .set(shake(updatedAttraction))
    .where(eq(AttractionsTable.id, uuid))
    .returning()

  if (media?.id) {
    await db
      .insert(PlacesToMediasTable)
      .values({
        placeId: place?.id || attraction.placeId,
        mediaId: media.id,
        active: true,
      })
      .onConflictDoNothing()
  }
  return attraction
})
