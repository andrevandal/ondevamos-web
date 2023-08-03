import { consola } from 'consola'
import { eq, InferModel } from 'drizzle-orm'
import { generateUuid } from '@/server/services/nanoid'
import { db } from '@/server/services/database'
import { addresses } from '@/server/schemas/db/addresses'

type Identifier = Partial<Pick<InferModel<typeof addresses>, 'id' | 'uuid'>>
type NewAddress = Omit<
  InferModel<typeof addresses, 'insert'>,
  'id' | 'uuid' | 'createdAt' | 'updatedAt'
>
type UpdateAddress = Partial<
  Pick<
    InferModel<typeof addresses>,
    | 'street'
    | 'number'
    | 'complement'
    | 'neighborhood'
    | 'cityId'
    | 'latitude'
    | 'longitude'
  >
>

const logError = (error: unknown, context: string) => {
  consola.error(
    `[${context}] ${error instanceof Error ? error.message : error}`,
  )
}

const prepareCondition = (options: Identifier) => {
  const { id, uuid } = options

  if (id) return eq(addresses.id, id)
  if (uuid) return eq(addresses.uuid, uuid)

  throw new Error('No address identifier provided')
}

export const getAddress = async (options: Identifier) => {
  try {
    const whereConditions = prepareCondition(options)
    const [addressData] = await db
      .select()
      .from(addresses)
      .where(whereConditions)
      .limit(1)
    return addressData
  } catch (error) {
    logError(error, 'Address Repository - getAddress')
    throw error
  }
}

export const createAddress = async (data: NewAddress) => {
  try {
    const uuid = generateUuid()
    const newAddress = await db.insert(addresses).values({ uuid, ...data })

    if (!newAddress.insertId) throw new Error('Address not created')
    return newAddress
  } catch (error) {
    logError(error, 'Address Repository - createAddress')
    throw error
  }
}

export const updateAddress = async (
  options: Identifier,
  data: UpdateAddress,
) => {
  try {
    const whereConditions = prepareCondition(options)
    const updatedAddress = await db
      .update(addresses)
      .set(data)
      .where(whereConditions)

    if (!updatedAddress.rowsAffected) throw new Error('Address not updated')
    return updatedAddress
  } catch (error) {
    logError(error, 'Address Repository - updateAddress')
    throw error
  }
}

export const deleteAddress = async (options: Identifier) => {
  try {
    const whereConditions = prepareCondition(options)
    const deletedAddress = await db.delete(addresses).where(whereConditions)
    if (!deletedAddress.rowsAffected) throw new Error('Address not deleted')
    return deletedAddress
  } catch (error) {
    logError(error, 'Address Repository - deleteAddress')
    throw error
  }
}

export default {
  getAddress,
  createAddress,
  updateAddress,
  deleteAddress,
}
