import { Generated } from 'kysely'

export interface AddressTable {
  addressId: Generated<string>
  street: string
  number: string
  complement: string | null
  neighborhood: string
  city: string
  state: string
  country: string
  zipCode: string
  latitude: number
  longitude: number
  createdAt: Generated<Date>
  updatedAt: Date | null
}
