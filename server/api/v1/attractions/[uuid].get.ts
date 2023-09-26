import { useAuth } from '@/server/services/auth'
import { validateParams } from '@/server/services/schemaValidation'
import { getAttractionFormated } from '@/server/repositories/attractions'
import {
  type ParamsUUIDSchema,
  paramsUUIDSchema,
} from '@/server/schemas/endpoints'

export default defineEventHandler(async (event) => {
  useAuth(event)

  const { uuid } = await validateParams<ParamsUUIDSchema>(
    event,
    paramsUUIDSchema,
  )

  const attractions = await getAttractionFormated({ uuid })

  return {
    uuid: attractions.uuid,
    title: attractions.title,
    description: attractions.description,
    featured: attractions.featured,
    order: attractions.order,
    active: attractions.active,
    mediaUuid: attractions.media?.uuid,
    mediaUrl: attractions.media?.url,
    place: attractions.place,
  }

  // return attractions.map((attraction) => ({

  // })

  // return cities.map((city) => ({
  //   uuid: city.uuid,
  //   ibgeCode: city.ibgeCode,
  //   name: city.name,
  //   state: city.state,
  //   country: city.country,
  //   label: city.label,
  //   createdAt: city.createdAt,
  //   updatedAt: city.updatedAt,
  // }))
})
