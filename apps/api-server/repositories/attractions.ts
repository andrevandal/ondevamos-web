import { shake } from 'radash'

import { consola } from 'consola'
import { eq, type InferSelectModel, type InferInsertModel } from 'drizzle-orm'
import { db } from '@/services/database'
import { AttractionsTable } from '@/schemas/db/index'

type SelectAttraction = InferSelectModel<typeof AttractionsTable>
type InsertAttraction = InferInsertModel<typeof AttractionsTable>

type Identifier = Pick<SelectAttraction, 'id' | 'placeId'>

export type NewAttraction = Omit<
  InsertAttraction,
  'id' | 'createdAt' | 'updatedAt'
>
export type UpdateAttraction = Partial<
  Pick<
    InsertAttraction,
    | 'title'
    | 'description'
    | 'mediaId'
    | 'featured'
    | 'order'
    | 'placeId'
    | 'active'
  >
>

const logError = (error: unknown, context: string) => {
  consola.error(
    `[${context}] ${error instanceof Error ? error.message : error}`,
  )
}

const prepareCondition = (options: Partial<Identifier>) => {
  const { id, placeId } = options

  if (id) return eq(AttractionsTable.id, id)
  if (placeId) return eq(AttractionsTable.placeId, placeId)

  throw new Error('No attraction identifier provided')
}

export const createAttraction = async (data: NewAttraction) => {
  try {
    const attractions = await db
      .insert(AttractionsTable)
      .values(data)
      .returning()

    return attractions
  } catch (error) {
    logError(error, 'Attraction Repository - createAttraction')
    throw null
  }
}

export const updateAttraction = async (
  id: InsertAttraction['id'],
  data: UpdateAttraction,
) => {
  try {
    const values = shake(data)

    const attractions = await db
      .update(AttractionsTable)
      .set({
        ...values,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(AttractionsTable.id, id))
      .returning()

    return attractions
  } catch (error) {
    logError(error, 'Attraction Repository - createAttraction')
    return null
  }
}

export const deleteAttraction = async (options: Partial<Identifier>) => {
  try {
    const whereConditions = prepareCondition(options)

    const deletedAttractions = await db
      .delete(AttractionsTable)
      .where(whereConditions)
      .returning({ deletedId: AttractionsTable.id })

    return deletedAttractions
  } catch (error) {
    logError(error, 'Attraction Repository - deleteAttraction')
    return null
  }
}

export const activateAttraction = (options: InsertAttraction['id']) =>
  updateAttraction(options, { active: true })

export const deactivateAttraction = (options: InsertAttraction['id']) =>
  updateAttraction(options, { active: false })

export default {
  createAttraction,
  updateAttraction,
  deleteAttraction,
  activateAttraction,
  deactivateAttraction,
}
