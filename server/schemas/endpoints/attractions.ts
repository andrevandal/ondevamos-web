import { z } from 'zod'

export const createAttractionSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  media: z
    .string()
    .regex(/^[0-9A-Za-z_]{12}$/, { message: 'Invalid UUID' })
    .optional(),
  featured: z.coerce.boolean().default(false),
  active: z.coerce.boolean().default(false),
  order: z.coerce.number().default(0),
})

export type CreateAttractionSchema = z.infer<typeof createAttractionSchema>

export const updateAttractionsSchema = z.object({
  place: z
    .string()
    .regex(/^[0-9A-Za-z_]{12}$/, { message: 'Invalid UUID' })
    .optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  media: z
    .string()
    .regex(/^[0-9A-Za-z_]{12}$/, { message: 'Invalid UUID' })
    .optional(),
  featured: z.coerce.boolean().optional(),
  active: z.coerce.boolean().optional(),
  order: z.coerce.number().default(0),
})

export type UpdateAttractionsSchema = z.infer<typeof updateAttractionsSchema>
