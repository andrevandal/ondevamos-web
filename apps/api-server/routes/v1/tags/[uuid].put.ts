import { shake } from 'radash'
import { useAuth } from '@/services/auth'
import { updateTagSchema } from '@/schemas/endpoints'
import { db } from '@/services'
import { TagsTable } from '@/schemas/db'
import { eq, or } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  useAuth(event)

  const uuid = getRouterParam(event, 'uuid')

  const body = await readValidatedBody(event, updateTagSchema.parse)

  const [tag] = await db
    .update(TagsTable)
    .set({
      ...(body?.name && { name: body?.name }),
      ...(body?.label && { label: body?.label }),
      ...(body?.description && { description: body?.description }),
      ...((body?.iconName || body.iconClassName) && {
        icon: {
          ...(body?.iconName && { name: body.iconName }),
          ...(body?.iconClassName && { className: body.iconClassName }),
        },
      }),
      updatedAt: new Date().toISOString(),
    })
    .where(or(eq(TagsTable.id, uuid), eq(TagsTable.slug, uuid)))
    .returning()

  return tag
})
