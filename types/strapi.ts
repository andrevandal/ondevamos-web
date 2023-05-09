export type StrapiMediaFormatsContent = {
  ext: string
  url: string
  hash: string
  mime: string
  name: string
  path: string
  size: number
  width: number
  height: number
}

export type StrapiMediaFormats = {
  large: StrapiMediaFormatsContent
  small: StrapiMediaFormatsContent
  medium: StrapiMediaFormatsContent
  thumbnail: StrapiMediaFormatsContent
}

export type StrapiPlaces = {
  data: {
    id: number
    attributes: {
      title: string
      slug: string
      available: boolean
      description: string
      createdAt: string
      updatedAt: string
      publishedAt: string
      avatar?: {
        data: {
          id: number
          attributes: {
            name: string
            alternativeText: string
            caption: string
            width: number
            height: number
            formats: any
            hash: string
            ext: string
            mime: string
            size: number
            url: string
            previewUrl: string
            provider: string
            provider_metadata: any
            createdAt: string
            updatedAt: string
          }
        }
      }
      medias: {
        data: {
          id: number
          attributes: {
            name: string
            alternativeText?: string
            caption?: string
            width: number
            height: number
            formats: StrapiMediaFormats
            hash: string
            ext: string
            mime: string
            size: number
            url: string
            previewUrl: string
            provider: string
            provider_metadata: any
            createdAt: string
            updatedAt: string
          }
        }[]
      }
      ratingLevel: number
      priceLevel: number
    }
  }[]
}

export type StrapiApiResources = {
  data: {
    id: number
    attributes: {
      slug: string
      title: string
      label: string
      description: string
      emoji: string
      createdAt: string
      updatedAt: string
      places: StrapiPlaces
    }
  }[]
  meta: {
    pagination: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
}

export type StrapiCategoryAttributes = {
  label: string
  slug: string
  createdAt: string
  updatedAt: string
  publishedAt: string
  icon: string
}

export type StrapiCategoryData = {
  id: number
  attributes: StrapiCategoryAttributes
}[]

export type StrapiCategoriesResponse = {
  data: StrapiCategoryData
}
