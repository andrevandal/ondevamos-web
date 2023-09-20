import { z } from 'zod'
export const SpecialOpeningHoursSchema = z
  .object({
    uuid: z
      .string()
      .regex(/^[0-9A-Za-z_]{12}$/, { message: 'Invalid UUID' })
      .optional(),
    description: z.string().optional(),
    date: z.string().optional(),
    openTime: z.string().optional(),
    closeTime: z.string().optional(),
  })
  .optional()

export const OpeningHoursSchema = z
  .object({
    uuid: z
      .string()
      .regex(/^[0-9A-Za-z_]{12}$/, { message: 'Invalid UUID' })
      .optional(),
    dayOfWeek: z.string().optional(),
    openTime: z.string().optional(),
    closeTime: z.string().optional(),
    active: z.coerce.boolean().optional(),
  })
  .optional()
