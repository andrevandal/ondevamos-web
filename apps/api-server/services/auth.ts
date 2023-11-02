import { H3Event } from 'h3'
const { adminToken } = useRuntimeConfig()

const isAdminTokenValid = (token: string) => token === adminToken

export function useAuth(event: H3Event) {
  const token = String(event.node.req.headers.authorization).split(' ')[1]

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }

  if (!isAdminTokenValid(token)) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden',
    })
  }

  return true
}
