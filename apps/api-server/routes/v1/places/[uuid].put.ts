import { shake, isEmpty } from 'radash'

import { useAuth } from '@/services/auth'
import { UpdatePlaceSchema } from '@/schemas/endpoints'
import { PlacesTable, PlacesToCategoriesTable, PlacesToTagsTable } from '@/schemas/db'
import { db } from '@/services'
import { eq, or } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  useAuth(event)

  const uuid = getRouterParam(event, 'uuid')

  const body = await readValidatedBody(event, UpdatePlaceSchema.parse)

  const address = shake({
    street: body?.addressStreet,
    number: body?.addressNumber,
    complement: body?.addressComplement,
    neighborhood: body?.addressNeighborhood,
    zipCode: body?.addressZipCode,
    latitude: body?.addressLatitude,
    longitude: body?.addressLongitude,
  })

  const actions = body?.actions?.map((action) => ({
    name: action.name,
    label: action.label,
    ...{
      icon: {
        ...(action.iconName && { name: action.iconName }),
        ...(action.iconClasses && { className: action.iconClasses }),
      },
    },
    url: action.link,
  }))

  let payload = {
    ...(body?.name && { name: body.name }),
    ...(body?.slug && { slug: body.slug }),
    ...(body?.description && { description: body.description }),
    ...(body?.ratingCount && { ratingCount: body.ratingCount }),
    ...(body?.pricingLevel && { pricingLevel: body.pricingLevel }),
    ...(body?.pricingCount && { pricingCount: body.pricingCount }),
    ...(!isEmpty(address) && { address }),
    ...(!isEmpty(actions) && { actions }),
    ...(body?.cover && { coverMedia: body.cover }),
    ...(body?.avatar && { avatarMedia: body.avatar }),
    ...(body?.city && { city: body.city }),
    ...(body?.externalId && { externalId: body.externalId }),
    ...(body?.active && { active: body.active }),
  }

  const updatedAt = new Date().toISOString()

  if (!isEmpty(payload)) {
    await db
      .update(PlacesTable)
      .set({
        ...shake(payload),
        updatedAt,
      })
      .where(or(eq(PlacesTable.id, uuid), eq(PlacesTable.slug, uuid)))
      .execute()
  }

  if (body?.categories) {
    const categories = await db.query.CategoriesTable.findMany({
      where: (CategoriesTable, { inArray }) =>
        inArray(CategoriesTable.slug, body.categories),
      columns: {
        id: true,
        slug: true,
      },
    }).execute()

    await db
      .delete(PlacesToCategoriesTable)
      .where(eq(PlacesToCategoriesTable.placeId, uuid))
      .execute()

    await db
      .insert(PlacesToCategoriesTable)
      .values(
        categories.map((el) => ({
          placeId: uuid,
          categoryId: el.id,
          active: true,
          updatedAt,
        })),
      )
      .execute()

    payload['categories'] = categories.map((el) => el.slug)
  }

  if(body?.tags) {
    const tags = await db.query.TagsTable.findMany({
      where: (TagsTable, { inArray }) =>
        inArray(TagsTable.slug, body.tags),
      columns: {
        id: true,
        slug: true,
      },
    }).execute()

    await db
      .delete(PlacesToTagsTable)
      .where(eq(PlacesToCategoriesTable.placeId, uuid))
      .execute()

    await db
      .insert(PlacesToTagsTable)
      .values(
        tags.map((el) => ({
          placeId: uuid,
          tagId: el.id,
          active: true,
          updatedAt,
        })),
      )
      .execute()

    payload['tags'] = tags.map((el) => el.slug)
  }


  return {
    ...payload
  }
})
