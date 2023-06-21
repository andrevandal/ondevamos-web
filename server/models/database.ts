import { ActionTable } from './action'
import { AddressTable } from './address'
import { AttractionTable } from './attraction'
import { CategoryTable } from './category'
import { MediaTable } from './media'
import { OpeningHourTable } from './openingHour'
import { PlaceTable } from './place'
import { TagTable } from './tag'

export interface Database {
  place: PlaceTable
  category: CategoryTable
  tag: TagTable
  media: MediaTable
  action: ActionTable
  attraction: AttractionTable
  opening_hour: OpeningHourTable
  address: AddressTable
}
