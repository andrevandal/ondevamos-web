import { Generated } from 'kysely'

export interface PlaceTable {
  placeId: Generated<string>
  name: string
  slug: string
  description: string
  ratingLevel: number
  ratingCount: number
  pricingLevel: number
  pricingLevelCount: number
  addressId: string
  coverMediaId: string
  avatarMediaId: string
  createdAt: Generated<Date>
  updatedAt: Date | null
}
