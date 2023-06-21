import { db } from '../services/database'

export default defineEventHandler(async (_event) => {
  try {
    const result = await db.selectFrom('address').selectAll('address').execute()
    console.log(result)
    return result
  } catch (error) {
    console.error(error)
  }
})
