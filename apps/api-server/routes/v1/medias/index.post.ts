import { z } from 'zod'
import { uuid as uuidv4 } from 'uuidv4';
import { useAuth } from '@/services/auth'
import { db } from '@/services/database'
import { MediasTable } from '@/schemas/db'
import { client, bucketName, endPoint } from '@/services/minio'

const bodySchema = z.object({
  lastModified: z.coerce.date(),
  filename: z.string(),
  size: z.coerce.number(),
  type: z.enum(['image/jpeg', 'image/png']),
})

const TypeTable = {
  'image/jpeg': 'image',
  'image/png': 'image',
}

export default defineEventHandler(async (event) => {
  useAuth(event)

  const data = await readValidatedBody(event, bodySchema.parse)
  const type = TypeTable[data?.type] as 'image'
  const uuid = uuidv4()

  const url = `https://${endPoint}/${bucketName}/medias/${uuid}/${data.filename}`

  const payload = {
    uuid,
    type,
    filename: data?.filename,
    url,
    externalMetadata: {
      ...data
    }
  }

  const [ media ] = await db.insert(MediasTable).values(payload).returning()

  if (!media) {
    return createError({
      statusCode: 500,
      statusMessage: 'Error creating media',
      data: { uuid },
      stack: undefined,
    })
  }

  const urlToUpload = await client.presignedPutObject(
    bucketName,
    `medias/${uuid}/${data.filename}`,
  )

  return {
    url: urlToUpload,
    uuid,
  }
})
