import { z } from 'zod'
import { validateBody } from '@/server/services/schemaValidation'
import { useAuth } from '@/server/services/auth'
import { generateUuid } from '~/server/services'
import { db } from '@/server/services/database'
import { medias } from '@/server/schemas/db/medias'
import { client, bucketName, endPoint } from '@/server/services/minio'

const bodySchema = z.object({
  lastModified: z.coerce.number(),
  name: z.string(),
  size: z.coerce.number(),
  type: z.enum(['image/jpeg', 'image/png']),
})
type BodySchema = z.infer<typeof bodySchema>

const TypeTable = {
  'image/jpeg': 'image',
  'image/png': 'image',
}

const grabExtension = (name: string) => name.split('.').pop()

export default defineEventHandler(async (event) => {
  useAuth(event)
  const data = await validateBody<BodySchema>(event, bodySchema)

  const type = TypeTable[data.type]
  const uuid = generateUuid()
  const extension = grabExtension(data.name)
  const filename = `${uuid}.${extension}`

  const urlToUpload = await client.presignedPutObject(
    bucketName,
    `medias/${filename}`,
  )

  const url = `https://${endPoint}/${bucketName}/medias/${filename}`

  const newMedia = await db.insert(medias).values({
    uuid,
    type,
    title: data.name,
    description: '',
    alternativeText: '',
    url,
    externalMetadata: { ...data },
  })

  if (!newMedia) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Error creating media',
      data: { uuid },
      stack: undefined,
    })
  }

  return {
    url: urlToUpload,
    uuid,
  }
})
