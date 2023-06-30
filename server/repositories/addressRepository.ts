import { consola } from 'consola'
import { eq, InferModel } from 'drizzle-orm'
import { nanoid } from '@/server/services/uuid'
import { db } from '@/server/services/database'
import { address } from '@/server/schemas/database'

type Identifier = Partial<Pick<InferModel<typeof address>, 'id' | 'uuid'>>
type NewAddress = Omit<
  InferModel<typeof address, 'insert'>,
  'id' | 'uuid' | 'createdAt' | 'updatedAt'
>
type UpdateAddress = Partial<
  Pick<
    InferModel<typeof address>,
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

  if (id) return eq(address.id, id)
  if (uuid) return eq(address.uuid, uuid)

  throw new Error('No address identifier provided')
}

export const getAddress = async (options: Identifier) => {
  try {
    const whereConditions = prepareCondition(options)
    const [addressData] = await db
      .select()
      .from(address)
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
    const uuid = nanoid()
    const newAddress = await db.insert(address).values({ uuid, ...data })

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
      .update(address)
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
    const deletedAddress = await db.delete(address).where(whereConditions)
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
