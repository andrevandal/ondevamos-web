import { z } from 'zod'

export * from './places'
export * from './attractions'
export * from './categories'
export * from './tags'

export const paramsUUIDSchema = z.object({
  uuid: z.string().regex(/^[0-9A-Za-z_]{12}$/, { message: 'Invalid UUID' }),
})

export type ParamsUUIDSchema = z.infer<typeof paramsUUIDSchema>

export const paramsUUIDSlugSchema = z.object({
  uuid: z.string(),
})

export type ParamsUUIDSlugSchema = z.infer<typeof paramsUUIDSlugSchema>
