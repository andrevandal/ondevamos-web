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

export type Category = {
  slug: string
  label: string
  icon: string
}
