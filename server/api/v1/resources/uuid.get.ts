import { useAuth } from '@/server/services/auth'
import { generateUuid } from '@/server/services/nanoid'

export default defineEventHandler((event) => {
  useAuth(event)

  return generateUuid()
})
