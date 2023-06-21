import { Generated } from 'kysely'

export interface CategoryTable {
  categoryId: Generated<string>
  name: string
  slug: string
  description: string
  iconName: string
  createdAt: Generated<Date>
  updatedAt: Date | null
}
