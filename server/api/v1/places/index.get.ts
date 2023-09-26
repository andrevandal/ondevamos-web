import { eq, asc } from 'drizzle-orm'
import { db } from '@/server/services/database'
import {
  places as PlacesTables,
  cities as CitiesTable,
  attractions as AttractionsTable,
  placesToCategories as PlacesToCategoriesTable,
  placesToTags as PlacesToTagsTable,
} from '@/server/schemas/db/places'

import { categories as CategoriesTable } from '@/server/schemas/db/categories'
import { tags as TagsTable } from '@/server/schemas/db/tags'
import { medias as MediasTable } from '~/server/schemas/db/medias'
import { useAuth } from '@/server/services/auth'

export default defineEventHandler(async (event) => {
  useAuth(event)

  const placesRows = await db
    .select({
      places: PlacesTables,
      cities: CitiesTable,
      attractions: AttractionsTable,
      categories: CategoriesTable,
      tags: TagsTable,
      medias: MediasTable,
    })
    .from(PlacesTables)
    .leftJoin(CitiesTable, eq(PlacesTables.city, CitiesTable.id))
    .leftJoin(AttractionsTable, eq(PlacesTables.id, AttractionsTable.placeId))
    .leftJoin(MediasTable, eq(AttractionsTable.mediaId, MediasTable.id))
    .leftJoin(
      PlacesToCategoriesTable,
      eq(PlacesTables.id, PlacesToCategoriesTable.placeId),
    )
    .leftJoin(
      CategoriesTable,
      eq(PlacesToCategoriesTable.categoryId, CategoriesTable.id),
    )
    .leftJoin(PlacesToTagsTable, eq(PlacesTables.id, PlacesToTagsTable.placeId))
    .leftJoin(TagsTable, eq(PlacesToTagsTable.tagId, TagsTable.id))
    .groupBy(
      PlacesTables.id,
      AttractionsTable.id,
      PlacesToCategoriesTable.categoryId,
      PlacesToTagsTable.tagId,
      MediasTable.id,
    )
    .orderBy(asc(PlacesTables.id), asc(AttractionsTable.order))
  const result = placesRows.reduce<Record<string, any>>((acc, row) => {
    const place = row.places
    const city = row.cities
    const attraction = row.attractions
    const category = row.categories
    const tag = row.tags
    const media = row.medias

    if (!acc[place.id]) {
      acc[place.id] = {
        uuid: place.uuid,
        name: place.name,
        slug: place.slug,
        description: place.description,
        ratingLevel: place.ratingLevel,
        ratingCount: place.ratingCount,
        pricingLevel: place.pricingLevel,
        pricingCount: place.pricingCount,
        active: place.active,
        externalId: place.externalId,
        avatar: place.avatarMedia,
        cover: place.coverMedia,
        addressStreet: place.address?.street,
        addressNumber: place.address?.number,
        addressComplement: place.address?.complement,
        addressNeighborhood: place.address?.neighborhood,
        addressZipCode: place.address?.zipCode,
        addressLongitude: place.address?.longitude,
        addressLatitude: place.address?.latitude,
        actions: place.actions,
        cityName: city?.name,
        cityUuid: city?.uuid,
        attractions: [],
        categories: [],
        tags: [],
      }
    }

    if (
      attraction &&
      !acc[place.id].attractions.find((a: any) => a.uuid === attraction.uuid)
    ) {
      acc[place.id].attractions.push({
        uuid: attraction.uuid,
        title: attraction.title,
        description: attraction.description,
        media: {
          uuid: media?.uuid,
          type: media?.type,
          title: media?.title,
          description: media?.description,
          alternativeText: media?.alternativeText,
          url: media?.url,
          active: media?.active,
          status: media?.status,
          createdAt: media?.createdAt,
          updatedAt: media?.updatedAt,
        },
        featured: attraction.featured,
        active: attraction.active,
        order: attraction.order,
        createdAt: attraction.createdAt,
        updatedAt: attraction.updatedAt,
      })
    }

    if (
      category &&
      !acc[place.id].categories.find((c: any) => c.uuid === category.uuid)
    ) {
      acc[place.id].categories.push({
        uuid: category.uuid,
        slug: category.slug,
        name: category.name,
        label: category.label,
        description: category.description,
        iconName: category.icon?.name,
        iconClasses: category.icon?.className,
        active: category.active,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
      })
    }

    if (tag && !acc[place.id].tags.find((t: any) => t.uuid === tag.uuid)) {
      acc[place.id].tags.push({
        uuid: tag.uuid,
        slug: tag.slug,
        name: tag.name,
        label: tag.label,
        description: tag.description,
        iconName: tag.icon?.name,
        iconClasses: tag.icon?.className,
        active: tag.active,
        createdAt: tag.createdAt,
        updatedAt: tag.updatedAt,
      })
    }

    return acc
  }, {})

  const placesArray = Object.values(result)

  return placesArray
})
