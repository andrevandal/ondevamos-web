import { z } from 'zod'

const periodSchema = z.array(
  z
    .tuple([
      z
        .number()
        .min(
          0,
          'A hora de abertura deve ser uma unidade de tempo entre 0000 e 2359',
        ),
      z
        .number()
        .max(
          2359,
          'A hora de fechamento deve ser uma unidade de tempo entre 0000 e 2359',
        ),
    ])
    .refine((val) => val[0] < val[1], {
      message: 'The closing time must be greater than the opening time',
      path: ['period'],
    }),
)

const refinePeriod = (val: any, ctx: any) => {
  if ((val.isOpen24Hours || val.isClosed) && val.period) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `No period should be provided if the place is open 24 hours or closed.`,
      fatal: true,
    })
    return
  }
  if (!val.period && !(val.isOpen24Hours || val.isClosed)) {
    if (!(val.isOpen24Hours || val.isClosed)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `A period must be provided if the place is not open 24 hours nor closed.`,
        fatal: true,
      })
    }
    return
  }

  if (
    val.period &&
    val.period.length > 1 &&
    val.period[0][1] > val.period[1][0]
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: `The closing time must be greater than the opening time.`,
      path: ['period'],
    })
  }
}

export type Period = z.infer<typeof periodSchema>

export const createOpeningHoursSchema = z.array(
  z
    .object({
      dayOfWeek: z.number(),
      active: z.boolean().default(true),
      isOpen24Hours: z.boolean().default(false),
      isClosed: z.boolean().default(false),
      period: periodSchema.optional(),
    })
    .superRefine((val, ctx) => refinePeriod(val, ctx)),
)

export type CreateOpeningHours = z.infer<typeof createOpeningHoursSchema>

// Similarly for special opening hours schema
export const createSpecialOpeningHoursSchema = z
  .object({
    description: z.string().optional(),
    startDate: z.string(),
    endDate: z.string(),
    isOpen24Hours: z.boolean().default(false),
    isClosed: z.boolean().default(false),
    period: periodSchema.optional(),
  })
  .superRefine((val, ctx) => refinePeriod(val, ctx))

export type CreateSpecialOpeningHours = z.infer<
  typeof createSpecialOpeningHoursSchema
>

export const updateOpeningHoursSchema = z
  .object({
    dayOfWeek: z.number().optional(),
    active: z.boolean().optional(),
    isOpen24Hours: z.boolean().optional(),
    isClosed: z.boolean().optional(),
    period: periodSchema.optional(),
  })
  .superRefine((val, ctx) => refinePeriod(val, ctx))

export type UpdateOpeningHours = z.infer<typeof updateOpeningHoursSchema>

export const updateSpecialOpeningHoursSchema = z
  .object({
    description: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    isOpen24Hours: z.boolean().optional(),
    isClosed: z.boolean().optional(),
    period: periodSchema.optional(),
  })
  .superRefine((val, ctx) => refinePeriod(val, ctx))

export type UpdateSpecialOpeningHours = z.infer<
  typeof updateSpecialOpeningHoursSchema
>
