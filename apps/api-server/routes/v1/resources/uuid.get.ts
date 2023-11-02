import { useAuth } from '../../../services/auth'
import { generateUuid } from '../../../services/nanoid'

export default defineEventHandler((event) => {
  useAuth(event)

  return {
    uuid: generateUuid(),
  }
})
