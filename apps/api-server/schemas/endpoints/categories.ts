import { z } from 'zod'

export const createCategorySchema = z.object({
  slug: z.string(),
  name: z.string(),
  label: z.string(),
  description: z.string().optional(),
  iconName: z.string().optional(),
  iconClasses: z.string().optional(),
})

export type CreateCategorySchema = z.infer<typeof createCategorySchema>

export const updateCategorySchema = z.object({
  name: z.string().optional(),
  label: z.string().optional(),
  description: z.string().optional(),
  iconName: z.string().optional(),
  iconClasses: z.string().optional(),
  active: z.boolean().optional(),
})
export type UpdateCategorySchema = z.infer<typeof updateCategorySchema>
