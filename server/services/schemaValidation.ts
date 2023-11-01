// import { consola } from 'consola'
import { H3Event, EventHandlerRequest } from 'h3'
import { z } from 'zod'
import { zh } from 'h3-zod'

export async function validateParams<T>(
  event: H3Event,
  schema: z.ZodType<any, any, any>,
) {
  // const localLogger = consola.withTag('validateParams')

  const params = await zh.useSafeValidatedParams(event as any, schema)
  // localLogger.log('params', params)
  if (!params.success) {
    // localLogger.error('params.error', params.error)
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
  event: H3Event<EventHandlerRequest>,
  schema: z.ZodType<any, any, any>,
) {
  const query = await zh.useSafeValidatedQuery(event as any, schema)

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
  // const localLogger = consola.withTag('validateBody')

  const body = await zh.useSafeValidatedBody(event as any, schema)
  // localLogger.log('body', await readBody(event))

  if (!body.success) {
    // localLogger.error('body.error', JSON.stringify(body.error, null, 2))
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid request body',
      data: body.error,
      stack: undefined,
    })
  }

  return body.data as T
}
