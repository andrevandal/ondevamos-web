import * as qs from 'qs'
import { ofetch } from 'ofetch'

type StrapiMediaFormatsContent = {
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

type StrapiMediaFormats = {
  large: StrapiMediaFormatsContent
  small: StrapiMediaFormatsContent
  medium: StrapiMediaFormatsContent
  thumbnail: StrapiMediaFormatsContent
}

type StrapiPlaces = {
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
          id: 1
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

type StrapiApiResources = {
  data: {
    id: number
    attributes: {
      slug: string
      title: string
      label: string
      description: string
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

type Places = {
  id: number
  title: string
  slug: string
  available: boolean
  description?: string
  avatar?: Avatar
  medias?: Media[]
  ratingLevel: number
  priceLevel: number
}[]

type Resource = {
  id: number
  title: string
  label: string
  description?: string
  places?: Places
}

type ResourcesResponse = {
  data: Resource[]
  meta: {
    pagination: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
}

export default defineEventHandler(async () => {
  const runtimeConfig = useRuntimeConfig()

  const fullUrl = (string = '') =>
    new URL(string, runtimeConfig?.public?.strapi?.url).toString()

  const { data: strapiResources, meta } = await ofetch<StrapiApiResources>(
    fullUrl(
      `/api/resources?${qs.stringify(
        {
          sort: ['title:asc'],
          populate: {
            places: {
              populate: ['avatar', 'medias'],
            },
          },
        },
        {
          encodeValuesOnly: true,
        },
      )}`,
    ),
  )

  // Convert StrapiApiResources to ResourcesResponse
  const resources: Resource[] = strapiResources.map((resource) => ({
    id: resource.id,
    title: resource.attributes.title,
    label: resource.attributes.label,
    description: resource.attributes.description,
    places: resource.attributes.places.data.map((place) => ({
      id: place?.id,
      title: place.attributes.title,
      slug: place.attributes.slug,
      available: place.attributes.available,
      description: place.attributes.description,
      avatar:
        (place.attributes.avatar?.data?.id && {
          id: place.attributes.avatar?.data?.id,
          name: place.attributes.avatar?.data?.attributes.name,
          alternativeText:
            place.attributes.avatar?.data.attributes?.alternativeText,
          url: fullUrl(place.attributes.avatar?.data.attributes?.url),
        }) ||
        undefined,
      medias: place.attributes?.medias.data?.map((media) => ({
        id: media.id,
        alternativeText: media.attributes?.alternativeText,
        url: fullUrl(media.attributes?.url),
      })),
      ratingLevel: place.attributes.ratingLevel,
      priceLevel: place.attributes.priceLevel,
    })),
  }))

  // Return ResourcesResponse
  return {
    data: resources,
    meta,
  } as ResourcesResponse
})
