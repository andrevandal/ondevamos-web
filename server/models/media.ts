import { Generated } from 'kysely'

export interface MediaTable {
  mediaId: Generated<string>
  type: 'image' | 'video'
  title: string
  description: string
  alternativeText: string
  url: string
  createdAt: Generated<Date>
  updatedAt: Date | null
}
