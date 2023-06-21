import { Generated } from 'kysely'

export interface ActionTable {
  actionId: Generated<string>
  placeId: string
  title: string
  link: string
  iconName: string | null
  createdAt: Generated<Date>
  updatedAt: Date | null
}
