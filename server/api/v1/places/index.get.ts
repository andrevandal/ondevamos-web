import { eq, asc } from 'drizzle-orm'
import { db } from '@/server/services/database'
import { places, cities } from '@/server/schemas/db/places'

export default defineEventHandler(async () => {
  const availablePlaces = db
    .select()
    .from(places)
    // .where(eq(places.active, true))
    .as('available_places')

  const selectedCategories = await db
    .select({
      uuid: availablePlaces.uuid,
      name: availablePlaces.name,
      slug: availablePlaces.slug,
      description: availablePlaces.description,
      ratingLevel: availablePlaces.ratingLevel,
      ratingCount: availablePlaces.ratingCount,
      pricingLevel: availablePlaces.pricingLevel,
      pricingCount: availablePlaces.pricingCount,
      coverMedia: availablePlaces.coverMedia,
      avatarMedia: availablePlaces.avatarMedia,
      address: availablePlaces.address,
      actions: availablePlaces.actions,
      // attractions: availablePlaces.attractions,
      city: cities.name,
      state: cities.state,
      country: cities.country,
    })
    .from(availablePlaces)
    .leftJoin(cities, eq(availablePlaces.city, cities.id))
    .groupBy(availablePlaces.id)
    .orderBy(asc(availablePlaces.id))
  return selectedCategories
})
