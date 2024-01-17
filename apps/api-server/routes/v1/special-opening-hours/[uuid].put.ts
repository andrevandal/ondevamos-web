import { useAuth } from '@/services/auth'
import { updateSpecialOpeningHoursSchema } from '@/schemas/endpoints'
import { eq } from 'drizzle-orm'
import { db } from '@/services/database'
import { SpecialOpeningHoursTable } from '@/schemas/db/index'

export default defineEventHandler(async (event) => {
  useAuth(event)

  const uuid = getRouterParam(event, 'uuid')

  const body = await readValidatedBody(
    event,
    updateSpecialOpeningHoursSchema.parse,
  )

  const [specialOpeningHours] = await db
    .update(SpecialOpeningHoursTable)
    .set({
      description: body.description,
      startDate: body.startDate.toISOString(),
      endDate: body.endDate.toISOString(),
      openTime1: body.period[0][0],
      closeTime1: body.period[0][1],
      openTime2: body.period[1][0],
      closeTime2: body.period[1][1],
      isOpen24Hours: body.isOpen24Hours,
      isClosed: body.isClosed,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(SpecialOpeningHoursTable.id, uuid))
    .returning()

  return specialOpeningHours
})
