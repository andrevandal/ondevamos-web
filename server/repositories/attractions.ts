import * as _ from 'radash'
import { consola } from 'consola'
import {
  and,
  eq,
  type InferSelectModel,
  type InferInsertModel,
} from 'drizzle-orm'
import { generateUuid } from '@/server/services/nanoid'
import { db } from '@/server/services/database'
import { medias as mediasDb } from '@/server/schemas/db/medias'
import {
  places as placesDb,
  attractions as AttractionsDb,
} from '@/server/schemas/db/places'

type SelectAttraction = InferSelectModel<typeof AttractionsDb>
type InsertAttraction = InferInsertModel<typeof AttractionsDb>

type Identifier = Pick<SelectAttraction, 'id' | 'uuid' | 'placeId'>
export type NewAttraction = Omit<
  InsertAttraction,
  'id' | 'uuid' | 'createdAt' | 'updatedAt'
>
export type UpdateAttraction = Partial<
  Pick<
    NewAttraction,
    'title' | 'description' | 'mediaId' | 'featured' | 'order' | 'placeId'
  >
>

const logError = (error: unknown, context: string) => {
  consola.error(
    `[${context}] ${error instanceof Error ? error.message : error}`,
  )
}

const prepareCondition = (options: Partial<Identifier>) => {
  const { id, uuid, placeId } = options

  if (id) return eq(AttractionsDb.id, id)
  if (uuid) return eq(AttractionsDb.uuid, uuid)
  if (placeId) return eq(AttractionsDb.placeId, placeId)

  throw new Error('No attraction identifier provided')
}

export const getAttractionsFromPlace = async (
  placeId: Identifier['placeId'],
) => {
  try {
    const whereConditions = and(
      eq(AttractionsDb.placeId, placeId),
      // eq(AttractionsDb.active, true),
    )

    const attractions = await db
      .select({
        uuid: AttractionsDb.uuid,
        title: AttractionsDb.title,
        description: AttractionsDb.description,
        featured: AttractionsDb.featured,
        order: AttractionsDb.order,
        active: AttractionsDb.active,
        media: {
          uuid: mediasDb.uuid,
          url: mediasDb.url,
        },
      })
      .from(AttractionsDb)
      .leftJoin(mediasDb, eq(AttractionsDb.mediaId, mediasDb.id))
      .where(whereConditions)

    return attractions
  } catch (error) {
    logError(error, 'Attraction Repository - getAttraction')
    throw error
  }
}

export const getAttraction = async (options: Partial<Identifier>) => {
  try {
    const whereConditions = prepareCondition(options)
    const [attractionData] = await db
      .select()
      .from(AttractionsDb)
      .where(whereConditions)
      .limit(1)
    return attractionData
  } catch (error) {
    logError(error, 'Attraction Repository - getAttraction')
    throw error
  }
}

export const getAttractionFormated = async (options: Partial<Identifier>) => {
  try {
    const whereConditions = prepareCondition(options)
    const [attractionData] = await db
      .select({
        uuid: AttractionsDb.uuid,
        title: AttractionsDb.title,
        description: AttractionsDb.description,
        featured: AttractionsDb.featured,
        order: AttractionsDb.order,
        active: AttractionsDb.active,
        media: {
          url: mediasDb.url,
          uuid: mediasDb.uuid,
        },
        place: placesDb.slug,
      })
      .from(AttractionsDb)
      .where(whereConditions)
      .leftJoin(placesDb, eq(AttractionsDb.placeId, placesDb.id))
      .leftJoin(mediasDb, eq(AttractionsDb.mediaId, mediasDb.id))
      .limit(1)
    return attractionData
  } catch (error) {
    logError(error, 'Attraction Repository - getAttraction')
    throw error
  }
}

export const createAttraction = async (data: NewAttraction) => {
  try {
    const uuid = generateUuid()
    const newAttraction = await db
      .insert(AttractionsDb)
      .values({ uuid, ...data })

    if (!newAttraction.insertId) throw new Error('Attraction not created')

    return _.omit({ uuid, ...data }, ['placeId'])
  } catch (error) {
    logError(error, 'Attraction Repository - createAttraction')
    throw error
  }
}

export const updateAttraction = async (
  options: Partial<Identifier>,
  data: UpdateAttraction,
) => {
  try {
    const whereConditions = prepareCondition(options)

    const updatedData = {
      ...data,
      updatedAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
    }

    const updatedAttraction = await db
      .update(AttractionsDb)
      .set(updatedData)
      .where(whereConditions)

    if (!updatedAttraction.rowsAffected)
      throw new Error('Attraction not updated')
    return _.omit(updatedData, ['placeId'])
  } catch (error) {
    logError(error, 'Attraction Repository - updateAttraction')
    throw error
  }
}

export const deleteAttraction = async (options: Identifier) => {
  try {
    const whereConditions = prepareCondition(options)
    const deletedAttraction = await db
      .delete(AttractionsDb)
      .where(whereConditions)
    if (!deletedAttraction.rowsAffected)
      throw new Error('Attraction not deleted')
    return deletedAttraction
  } catch (error) {
    logError(error, 'Attraction Repository - deleteAttraction')
    throw error
  }
}

export default {
  getAttraction,
  createAttraction,
  updateAttraction,
  deleteAttraction,
}
