chegou a hora de começarmos a implementar o horário de funcionamento de um place para podermos determinar se ele está aberto ou não.

hoje, nossa estrutura para esse tipo de dado é a seguinte:

```ts
export const openingHours = mysqlTable(
  'opening_hours',
  {
    id: bigint('id', { mode: 'number' }).autoincrement().primaryKey().notNull(),
    uuid: varchar('uuid', { length: 12 }).notNull(),
    placeId: bigint('place_id', { mode: 'number' }).notNull(),
    dayOfWeek: int('day_of_week').notNull(),
    openTime1: int('open_time1').notNull(),
    closeTime1: int('close_time1').notNull(),
    openTime2: int('open_time2'),
    closeTime2: int('close_time2'),
    active: boolean('active').default(false),
    isOpen24Hours: boolean('is_open_24_hours').default(false),
    isClosed: boolean('is_closed').default(false),
    createdAt: timestamp('created_at', { mode: 'string' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp('updated_at', { mode: 'string' }),
  },
  (table) => {
    return {
      uuid: uniqueIndex('uuid').on(table.uuid),
    }
  },
)

// Special Opening Hours table
export const specialOpeningHours = mysqlTable(
  'special_opening_hours',
  {
    id: bigint('id', { mode: 'number' }).autoincrement().primaryKey().notNull(),
    uuid: varchar('uuid', { length: 12 }).notNull(),
    placeId: bigint('place_id', { mode: 'number' }).notNull(),
    description: text('description'),
    startDate: date('start_date').notNull(),
    endDate: date('end_date').notNull(),
    openTime1: int('open_time1').notNull(),
    closeTime1: int('close_time1').notNull(),
    openTime2: int('open_time2'),
    closeTime2: int('close_time2'),
    isOpen24Hours: boolean('is_open_24_hours').default(false),
    isClosed: boolean('is_closed').default(false),
    createdAt: timestamp('created_at', { mode: 'string' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp('updated_at', { mode: 'string' }),
  },
  (table) => {
    return {
      uuid: uniqueIndex('uuid').on(table.uuid),
    }
  },
)
```

o horário de funcionamento regular será escrito em uma tabela chamada opening_hours, e o horário de funcionamento especial será escrito em uma tabela chamada special_opening_hours.

a minha necessidade é conseguir ter esses dados num formato que dialogue com a seguinte estrutura:

```json
{
  "current_opening_hours": {
    "open_now": false,
    "periods": [
      {
        "close": {
          "date": "2023-10-02",
          "day": 1,
          "time": "1830"
        },
        "open": {
          "date": "2023-10-02",
          "day": 1,
          "time": "1030"
        }
      },
      {
        "close": {
          "date": "2023-09-26",
          "day": 2,
          "time": "1830"
        },
        "open": {
          "date": "2023-09-26",
          "day": 2,
          "time": "1030"
        }
      },
      {
        "close": {
          "date": "2023-09-27",
          "day": 3,
          "time": "1830"
        },
        "open": {
          "date": "2023-09-27",
          "day": 3,
          "time": "1030"
        }
      },
      {
        "close": {
          "date": "2023-09-28",
          "day": 4,
          "time": "1830"
        },
        "open": {
          "date": "2023-09-28",
          "day": 4,
          "time": "1030"
        }
      },
      {
        "close": {
          "date": "2023-09-29",
          "day": 5,
          "time": "2100"
        },
        "open": {
          "date": "2023-09-29",
          "day": 5,
          "time": "1030"
        }
      }
    ],
    "weekday_text": [
      "Monday: 10:30 AM – 6:30 PM",
      "Tuesday: 10:30 AM – 6:30 PM",
      "Wednesday: 10:30 AM – 6:30 PM",
      "Thursday: 10:30 AM – 6:30 PM",
      "Friday: 10:30 AM – 9:00 PM",
      "Saturday: Closed",
      "Sunday: Closed"
    ]
  },
}
```

Our function that checks if a place is open:

```ts
export const isPlaceOpen = async (identifiers: Partial<Identifier>) => {
  try {
    const localLogger = logger.withTag('isPlaceOpen')
    const placeId = await getPlaceId(identifiers)

    const today = new Date('2023-12-31')
    today.setUTCHours(12, 0, 0, 0)
    const todayDate = today.toISOString().split('T')[0]
    const dayOfWeek = today.getUTCDay() + 1

    localLogger.log('dayOfWeek', dayOfWeek, today, dayOfWeek)

    const [openingHours, specialOpeningHours] = (
      await Promise.allSettled([
        db
          .select()
          .from(OpeningHoursTable)
          .where(
            and(
              eq(OpeningHoursTable.placeId, placeId),
              eq(OpeningHoursTable.dayOfWeek, dayOfWeek),
            ),
          ),
        db
          .select()
          .from(SpecialOpeningHoursTable)
          .where(
            and(
              eq(SpecialOpeningHoursTable.placeId, placeId),
              and(
                lte(SpecialOpeningHoursTable.startDate, todayDate),
                gte(SpecialOpeningHoursTable.endDate, todayDate),
              ),
            ),
          ),
      ])
    ).map((el) => (el.status === 'fulfilled' ? el.value : null))

    return [openingHours, specialOpeningHours]
  } catch (error) {
    logError(error, 'Place Repository - isPlaceOpen')
    throw error
  }
}
```

the return of this function is an array of arrays, where the first array is the opening hours and the second array is the special opening hours.

```json
[
  [
    {
      "id": 8,
      "uuid": "BWrUmPcntAy4",
      "placeId": 2,
      "dayOfWeek": 1,
      "openTime1": 0,
      "closeTime1": 0,
      "openTime2": null,
      "closeTime2": null,
      "active": true,
      "isOpen24Hours": false,
      "isClosed": true,
      "createdAt": "2023-10-02 23:56:27",
      "updatedAt": null
    }
  ],
  [
    {
      "id": 2,
      "uuid": "p4NGF49JGrKv",
      "placeId": 2,
      "description": "Ano novo",
      "startDate": "2023-12-31",
      "endDate": "2024-01-01",
      "openTime1": 0,
      "closeTime1": 0,
      "openTime2": null,
      "closeTime2": null,
      "isOpen24Hours": false,
      "isClosed": true,
      "createdAt": "2023-10-03 00:26:22",
      "updatedAt": null
    }
  ]
]
```

based on that, think about the bussines logic that determin if the place is opened based on the current date and time and the opening hours and special opening hours.

###

The function that checks if a place is open:

```ts
const checkHours = (
  hours: Pick<
    InferSelectModel<typeof OpeningHoursTable>,
    | 'isClosed'
    | 'isOpen24Hours'
    | 'openTime1'
    | 'closeTime1'
    | 'openTime2'
    | 'closeTime2'
  >,
  currentTime: number,
) => {
  if (hours.isClosed) {
    return false
  } else if (hours.isOpen24Hours) {
    return true
  } else if (
    (hours.openTime1 <= currentTime && currentTime <= hours.closeTime1) ||
    (hours.openTime2 !== null &&
      hours.closeTime2 !== null &&
      hours.openTime2 <= currentTime &&
      currentTime <= hours.closeTime2)
  ) {
    return true
  }
  return false
}

export const isPlaceOpen = async (identifiers: Partial<Identifier>) => {
  try {
    const localLogger = logger.withTag('isPlaceOpen')
    const placeId = await getPlaceId(identifiers)

    const today = new Date() // pega data e horário UTC
    const todayDate = today.toISOString().split('T')[0]
    const dayOfWeek = today.getDay() + 1
    const currentTime = today.getHours() * 100 + today.getMinutes() // Hora atual no mesmo formato que o tempo de abertura

    localLogger.log('dayOfWeek', dayOfWeek, today, dayOfWeek)

    const openingHours = await db
      .select()
      .from(OpeningHoursTable)
      .where(
        and(
          eq(OpeningHoursTable.placeId, placeId),
          eq(OpeningHoursTable.dayOfWeek, dayOfWeek),
        ),
      )

    const specialOpeningHours = await db
      .select()
      .from(SpecialOpeningHoursTable)
      .where(
        and(
          eq(SpecialOpeningHoursTable.placeId, placeId),
          and(
            lte(SpecialOpeningHoursTable.startDate, todayDate),
            gte(SpecialOpeningHoursTable.endDate, todayDate),
          ),
        ),
      )

    // Verifica o horário especial
    const specialHour = specialOpeningHours.find(
      (hours) => hours.startDate <= todayDate && hours.endDate >= todayDate,
    )

    if (specialHour) {
      localLogger.log('specialHour', specialHour, currentTime)
      return checkHours(specialHour, currentTime)
    }

    // Verifica o horário regular
    const regularHour = openingHours.find(
      (hours) => hours?.dayOfWeek === dayOfWeek,
    )

    if (regularHour) {
      localLogger.log('regularHour', regularHour, currentTime)
      return checkHours(regularHour, currentTime)
    }

    return false
  } catch (error) {
    logError(error, 'Place Repository - isPlaceOpen')
    throw error
  }
}
```

based on that, modify the flowing code to return the current opening state of a place:

```ts
// GET /places
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
```

do not use `isPlaceOpen` directly, keep all the logic inside the function above.