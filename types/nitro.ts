type Avatar = {
  id: number
  name: string
  alternativeText: string
  url: string
}

type Media = {
  id: number
  alternativeText?: string
  url: string
}

export type Place = {
  id: number
  title: string
  slug: string
  available: boolean
  description?: string
  avatar?: Avatar
  medias?: Media[]
  ratingLevel: number
  priceLevel: number
}

export type Resource = {
  id: number
  title: string
  label: string
  description?: string
  emoji?: string
  places?: Place[]
}

export type ResourcesResponse = {
  data: Resource[] | Place[]
  meta: {
    pagination: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
}

export type PlaceResponse = {
  cover: {
    url: string
    alt: string
  }
  title: string
  avatar: string
  available: boolean
  address: string
  description: string
  rating: number
  price: number
  veganOptions: boolean
  petFriendly: boolean
  featuredMedias: {
    type: string
    src: string
    alt: string
  }[]
  actions: {
    icon: string
    label: string
    href: string
  }[]
  mainAttractions: {
    image: {
      src: string
      alt: string
    }
    title: string
    description: string
  }[]
  openNow: boolean
  openingHours: {
    day: string
    hour: string
  }[]
}

export type Category = {
  slug: string
  label: string
  icon: string
}
