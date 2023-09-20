import { z } from 'zod'

export const CreateAttractionsSchema = z.object({
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
export type CreateAttractions = z.infer<typeof CreateAttractionsSchema>

export const UpdateAttractionsSchema = z.object({
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
export type UpdateAttractions = z.infer<typeof UpdateAttractionsSchema>
