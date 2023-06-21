import { Generated } from 'kysely'

export interface TagTable {
  tagId: Generated<string>
  name: string
  slug: string
  description: string
  iconName: string
  createdAt: Generated<Date>
  updatedAt: Date | null
}
