export type Action = {
  type: string
  name: string
  link?: string
  iconName?: string
  iconClasses?: string
}

export type CreatePlace = {
  name: string
  slug: string
  description: string
  ratingLevel?: number
  ratingCount?: number
  pricingLevel?: number
  pricingCount?: number
  externalId?: string
  active?: boolean
  addressStreet?: string
  addressNumber?: string
  addressComplement?: string
  addressNeighborhood?: string
  addressZipCode?: string
  addressLatitude?: number
  addressLongitude?: number
  actions?: Action[]
  city: string
  avatar?: string
  cover?: string
  categories?: string[]
  tags?: string[]
  featuredMedias?: string[]
}

export type UpdatePlace = {
  name?: string
  slug?: string
  description?: string
  ratingLevel?: number
  ratingCount?: number
  pricingLevel?: number
  pricingCount?: number
  externalId?: string
  active?: boolean
  addressStreet?: string
  addressNumber?: string
  addressComplement?: string
  addressNeighborhood?: string
  addressZipCode?: string
  addressLatitude?: number
  addressLongitude?: number
  actions?: Action[]
  city?: string
  avatar?: string
  cover?: string
  categories?: string[]
  tags?: string[]
  featuredMedias?: string[]
}

export type UpdatePlaceCategories = string[]
export type UpdatePlaceTags = string[]
