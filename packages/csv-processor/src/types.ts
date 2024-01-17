import { type Action } from '@ondevamos/schemas'
import { type OpeningHour } from '../schemas/endpoints/openingHours'

export type AddressComponent = {
  long_name: string
  short_name: string
  types: string[]
}

export type Period = {
  close: {
    day: number
    time: string
  }
  open: {
    day: number
    time: string
  }
}

export type Geometry = {
  location: {
    lat: number
    lng: number
  }
  viewport: {
    northeast: {
      lat: number
      lng: number
    }
    southwest: {
      lat: number
      lng: number
    }
  }
}

export type Place = {
  address_components: AddressComponent[]
  delivery: boolean
  dine_in: boolean
  geometry: Geometry
  name: string
  opening_hours: {
    open_now: boolean
    periods: Period[]
    weekday_text: string[]
  }
  rating: number
  serves_beer?: boolean
  serves_vegetarian_food?: boolean
  serves_breakfast?: boolean
  serves_brunch?: boolean
  serves_dinner?: boolean
  serves_lunch?: boolean
  serves_wine?: boolean
  takeout: boolean
  types: string[]
  url: string
  price_level?: number
  user_ratings_total?: number
}

export type Row = {
  NOME: string
  CATEGORIAS: string
  CATEGORIAS_FOR_DB: string
  WHATSAPP: string
  INSTAGRAM: string
  'GOOGLE PLACE ID': string
  ATIVA: string
  CADASTRADA: string
}

export type TaskData = {
  name: string
  categories: string[]
  whatsapp: string
  instagram: string
  placeId: string
  active: boolean
  registered: boolean
}

export type EnhancedPlace = {
  name: string
  actions: Action[]
  city: string
  description: string
  slug: string
  ratingLevel: number
  ratingCount: number
  pricingCount: number
  pricingLevel: number
  externalId: string
  active: boolean
  addressStreet: string
  addressNumber: string
  addressComplement: string
  addressNeighborhood: string
  addressZipCode: string
  addressLongitude: number
  addressLatitude: number
  openingHours: OpeningHour[]
  tags: string[]
  categories: string[]
}
