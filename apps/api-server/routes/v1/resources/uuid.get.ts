import { useAuth } from '@/services/auth'
import { uuid as uuidv4 } from 'uuidv4';

export default defineEventHandler((event) => {
  useAuth(event)

  return {
    uuid: uuidv4(),
  }
})
