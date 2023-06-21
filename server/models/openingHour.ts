import { Generated } from 'kysely'

export interface OpeningHourTable {
  openingHourId: Generated<string>
  placeId: string
  dayOfWeek: string
  openTime: string
  closeTime: string
  createdAt: Generated<Date>
  updatedAt: Date | null
}
