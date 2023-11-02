import { z } from 'zod'

export const createTagSchema = z.object({
  slug: z.string(),
  name: z.string(),
  label: z.string(),
  description: z.string().optional(),
  iconName: z.string().optional(),
  iconClasses: z.string().optional(),
})

export type CreateTagSchema = z.infer<typeof createTagSchema>

export const updateTagSchema = z.object({
  name: z.string().optional(),
  label: z.string().optional(),
  description: z.string().optional(),
  iconName: z.string().optional(),
  iconClasses: z.string().optional(),
  active: z.boolean().optional(),
})
export type UpdateTagSchema = z.infer<typeof updateTagSchema>
