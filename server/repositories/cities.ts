import { consola } from 'consola'
import { eq, InferModel } from 'drizzle-orm'
import { generateUuid } from '@/server/services/nanoid'
import { db } from '@/server/services/database'
import { cities } from '@/server/schemas/db/addresses'

type Identifier = Partial<Pick<InferModel<typeof cities>, 'id' | 'uuid'>>
type NewCity = Omit<
  InferModel<typeof cities, 'insert'>,
  'id' | 'uuid' | 'createdAt' | 'updateAt'
>
type UpdateCity = Partial<
  Pick<
    InferModel<typeof cities>,
    'name' | 'state' | 'country' | 'latitude' | 'longitude'
  >
>

const logError = (error: unknown, context: string) => {
  consola.error(
    `[${context}] ${error instanceof Error ? error.message : error}`,
  )
}

const prepareCondition = (options: Identifier) => {
  const { id, uuid } = options

  if (id) return eq(cities.id, id)
  if (uuid) return eq(cities.uuid, uuid)

  throw new Error('No city identifier provided')
}

export const getCity = async (options: Identifier) => {
  try {
    const whereConditions = prepareCondition(options)
    const [cityData] = await db
      .select()
      .from(cities)
      .where(whereConditions)
      .limit(1)
    return cityData
  } catch (error) {
    logError(error, 'City Repository - getCity')
    throw error
  }
}

export const createCity = async (data: NewCity) => {
  try {
    const uuid = generateUuid()
    if (await getCity({ uuid })) throw new Error('City already exists')
    const newCity = await db.insert(cities).values({ ...data, uuid })

    if (!newCity.insertId) throw new Error('City not created')
    return newCity
  } catch (error) {
    logError(error, 'City Repository - createCity')
    throw error
  }
}

export const updateCity = async (options: Identifier, data: UpdateCity) => {
  try {
    const whereConditions = prepareCondition(options)
    const updatedCity = await db.update(cities).set(data).where(whereConditions)

    if (!updatedCity.rowsAffected) throw new Error('City not updated')
    return updatedCity
  } catch (error) {
    logError(error, 'City Repository - updateCity')
    throw error
  }
}

export const deleteCity = async (options: Identifier) => {
  try {
    const whereConditions = prepareCondition(options)
    const deletedCity = await db.delete(cities).where(whereConditions)
    if (!deletedCity.rowsAffected) throw new Error('City not deleted')
    return deletedCity
  } catch (error) {
    logError(error, 'City Repository - deleteCity')
    throw error
  }
}

export default {
  getCity,
  createCity,
  updateCity,
  deleteCity,
}
