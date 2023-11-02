import { z } from 'zod'

export const ActionSchema = z.object({
  type: z.string(),
  name: z.string(),
  link: z.string().optional(),
  iconName: z.string().optional(),
  iconClasses: z.string().optional(),
})

export type Action = z.infer<typeof ActionSchema>

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
  actions: z.array(ActionSchema).optional(),
  city: z
    .string()
    .regex(/^[0-9A-Za-z_]{12}$/, { message: 'Invalid City UUID' }),
  avatar: z
    .string()
    .regex(/^[0-9A-Za-z_]{12}$/, { message: 'Invalid UUID' })
    .optional(), // avatarMediaId
  cover: z
    .string()
    .regex(/^[0-9A-Za-z_]{12}$/, { message: 'Invalid UUID' })
    .optional(), // coverMediaId
  categories: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  featuredMedias: z
    .array(
      z.string().regex(/^[0-9A-Za-z_]{12}$/, {
        message: 'Featured medias: Invalid UUID',
      }),
    )
    .optional(),
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
  actions: z.array(ActionSchema).optional(),
  city: z
    .string()
    .regex(/^[0-9A-Za-z_]{12}$/, { message: 'Invalid City UUID' })
    .optional(),
  avatar: z
    .string()
    .regex(/^[0-9A-Za-z_]{12}$/, { message: 'Invalid UUID' })
    .optional(), // avatarMediaId
  cover: z
    .string()
    .regex(/^[0-9A-Za-z_]{12}$/, { message: 'Invalid UUID' })
    .optional(), // coverMediaId
  categories: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  featuredMedias: z
    .array(
      z.string().regex(/^[0-9A-Za-z_]{12}$/, {
        message: 'Featured medias: Invalid UUID',
      }),
    )
    .optional(),
})

export type UpdatePlace = z.infer<typeof UpdatePlaceSchema>

export const UpdatePlaceCategoriesSchema = z.array(z.string())
export type UpdatePlaceCategories = z.infer<typeof UpdatePlaceCategoriesSchema>

export const UpdatePlaceTagsSchema = z.array(z.string())
export type UpdatePlaceTags = z.infer<typeof UpdatePlaceTagsSchema>