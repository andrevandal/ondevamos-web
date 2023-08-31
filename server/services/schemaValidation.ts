import { H3Event } from 'h3'
import { z } from 'zod'
import { zh } from 'h3-zod'

export async function validateParams<T>(
  event: H3Event,
  schema: z.ZodType<any, any, any>,
) {
  const params = await zh.useSafeValidatedParams(event, schema)

  if (!params.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid request params',
      data: params.error,
      stack: undefined,
    })
  }

  return params.data as T
}

export async function validateQuery<T>(
  event: H3Event,
  schema: z.ZodType<any, any, any>,
) {
  const query = await zh.useSafeValidatedQuery(event, schema)

  if (!query.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid request query',
      data: query.error,
      stack: undefined,
    })
  }

  return query.data as T
}

export async function validateBody<T>(
  event: H3Event,
  schema: z.ZodType<any, any, any>,
) {
  const body = await zh.useSafeValidatedBody(event, schema)

  if (!body.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid request body',
      data: body.error,
      stack: undefined,
    })
  }

  return body.data as T
}
