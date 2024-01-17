import { checkHours } from 'utils'

import { db } from '@/services/database'

import { useAuth } from '@/services/auth'

export default defineEventHandler(async (event) => {
  useAuth(event)

  const today = new Date()
  const dayOfWeek = today.getDay()
  const currentTime = today.getHours() * 100 + today.getMinutes()

  const places = await db.query.PlacesTable.findMany({
    columns: {
      id: true,
      name: true,
      slug: true,
      description: true,
      ratingLevel: true,
      ratingCount: true,
      pricingLevel: true,
      pricingCount: true,
      active: true,
      externalId: true,
      avatarMedia: true,
      coverMedia: true,
      address: true,
      actions: true,
      city: true,
    },
    with: {
      city: {
        columns: {
          name: true,
          slug: true,
          state: true,
          id: true,
        },
      },
      attractions: {
        columns: {
          title: true,
          description: true,
          featured: true,
          active: true,
          order: true,
        },
        orderBy: (AttractionsTable, { asc }) => asc(AttractionsTable.order),
        where: (AttractionsTable, { eq }) => eq(AttractionsTable.active, true),
        with: {
          media: {
            columns: {
              type: true,
              title: true,
              description: true,
              alternativeText: true,
              url: true,
              active: true,
            },
          },
        },
      },
      categories: {
        with: {
          category: {
            columns: {
              slug: true,
              active: true,
            },
          },
        },
      },
      tags: {
        with: {
          tag: {
            columns: {
              slug: true,
              active: true,
            },
          },
        },
      },
      openingHours: {
        columns: {
          dayOfWeek: true,
          openTime1: true,
          closeTime1: true,
          openTime2: true,
          closeTime2: true,
          isOpen24Hours: true,
          isClosed: true,
        },
        limit: 1,
        where: (OpeningHoursTable, { eq }) =>
          eq(OpeningHoursTable.dayOfWeek, dayOfWeek),
      },
      specialOpeningHours: {
        columns: {
          startDate: true,
          endDate: true,
          openTime1: true,
          closeTime1: true,
          openTime2: true,
          closeTime2: true,
          isOpen24Hours: true,
          isClosed: true,
        },
        limit: 1,
        where: (SpecialOpeningHoursTable, { lte, gte, and }) =>
          and(
            lte(
              SpecialOpeningHoursTable.startDate,
              today.toISOString().split('T')[0],
            ),
            gte(
              SpecialOpeningHoursTable.endDate,
              today.toISOString().split('T')[0],
            ),
          ),
      },
    },
    where: (PlacesTable, { eq }) => eq(PlacesTable.active, true),
    orderBy: (PlacesTable, { asc }) => asc(PlacesTable.id),
  })

  const result = places.reduce((acc, place) => {
    const attractions = place.attractions
    const categories = place.categories.map(category => category.category.active ? category.category?.slug : null).filter(Boolean)
    const tags = place.tags.map(tag => tag.tag.active ? tag.tag?.slug : null).filter(Boolean)

    const [openingHoursToday] = place.openingHours
    const [specialOpeningHoursToday] = place.specialOpeningHours

    let openNow = false

    if (openingHoursToday && checkHours(openingHoursToday, currentTime)) {
      openNow = true
    } else if (
      specialOpeningHoursToday &&
      checkHours(specialOpeningHoursToday, currentTime)
    ) {
      openNow = true
    }
  
    acc.push({
      id: place.id,
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
      cityName: place.city?.name,
      cityId: place.city?.id,
      cityState: place.city?.state,
      attractions,
      categories,
      tags,
      open_now: openNow,
    })

    return acc
  }, [])

  return result
})
