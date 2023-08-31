import { z } from 'zod'

// import { zh } from 'h3-zod'

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

export const AttractionsSchema = z
  .object({
    uuid: z
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
  })
  .optional()

export const ActionsSchema = z.object({
  type: z.string(),
  name: z.string(),
  link: z.string().optional(),
  iconName: z.string().optional(),
  iconClasses: z.string().optional(),
})

export const MediasSchema = z
  .object({
    uuid: z
      .string()
      .regex(/^[0-9A-Za-z_]{12}$/, { message: 'Invalid UUID' })
      .optional(),
    type: z.string().optional(),
    title: z.string().optional(),
    description: z.string().optional(),
    alternativeText: z.string().optional(),
    url: z.string().optional(),
    featured: z.coerce.boolean().optional(),
    active: z.coerce.boolean().optional(),
  })
  .optional()

export const CreatePlaceSchema = z.object({
  name: z.string(),
  slug: z.string(),
  description: z.string(),
  ratingLevel: z.number().min(0).max(5).optional().default(0),
  ratingCount: z.number().optional().default(0),
  pricingLevel: z.number().min(0).max(4).optional().default(0),
  pricingCount: z.number().optional().default(0),
  externalId: z.string().optional(),
  active: z.boolean().optional().default(false),
  addressStreet: z.string().optional(),
  addressNumber: z.string().optional(),
  addressComplement: z.string().optional(),
  addressNeighborhood: z.string().optional(),
  addressZipCode: z.string().optional(),
  addressLatitude: z.coerce.number().optional(),
  addressLongitude: z.coerce.number().optional(),
  actions: z.array(ActionsSchema).optional(),
  city: z
    .string()
    .regex(/^[0-9A-Za-z_]{12}$/, { message: 'Invalid City UUID' }),
  // active: z.boolean().optional(),
  // avatar: z
  //   .string()
  //   .regex(/^[0-9A-Za-z_]{12}$/, { message: 'Invalid UUID' })
  //   .optional(), // avatarMediaId
  // cover: z
  //   .string()
  //   .regex(/^[0-9A-Za-z_]{12}$/, { message: 'Invalid UUID' })
  //   .optional(), // coverMediaId

  // openingHours: z.array(OpeningHoursSchema).optional(),
  // specialOpeningHours: z.array(SpecialOpeningHoursSchema).optional(),
  // attractions: z.array(AttractionsSchema).optional(),
  // actions: z.array(ActionsSchema).optional(),
  // medias: z.array(MediasSchema).optional(),
})

export type CreatePlace = z.infer<typeof CreatePlaceSchema>

export const UpdatePlaceSchema = z.object({
  name: z.string().optional(),
  slug: z.string().optional(),
  description: z.string().optional(),
  ratingLevel: z.number().min(0).max(5).optional(),
  ratingCount: z.number().optional(),
  pricingLevel: z.number().min(0).max(4).optional(),
  pricingCount: z.number().optional(),
  externalId: z.string().optional(),
  active: z.boolean().optional(),
  addressStreet: z.string().optional(),
  addressNumber: z.string().optional(),
  addressComplement: z.string().optional(),
  addressNeighborhood: z.string().optional(),
  addressLatitude: z.coerce.number().optional(),
  addressLongitude: z.coerce.number().optional(),
  addressZipCode: z.string().optional(),
  actions: z.array(ActionsSchema).optional(),
  city: z
    .string()
    .regex(/^[0-9A-Za-z_]{12}$/, { message: 'Invalid City UUID' })
    .optional(),
})

export type UpdatePlace = z.infer<typeof UpdatePlaceSchema>
