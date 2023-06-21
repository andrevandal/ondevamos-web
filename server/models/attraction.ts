import { Generated } from 'kysely'

export interface AttractionTable {
  attractionId: Generated<string>
  placeId: string
  title: string
  description: string
  mediaId: string | null
  isFeatured: boolean
  createdAt: Generated<Date>
  updatedAt: Date | null
}
