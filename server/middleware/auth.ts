// categories.get.ts

// import * as qs from 'qs'
// import { ofetch } from 'ofetch'

// import type { StrapiCategoriesResponse } from '@/types/strapi'
// import type { Category } from '@/types/nitro'

const protectedRoutes = [
  {
    path: '/api/categories',
    method: 'POST',
  },
  {
    path: '/api/tags',
    method: 'POST',
  },
]

const isRouteProtected = (path: string, method: string) =>
  !!protectedRoutes.find(
    (route) => route.path === path && route.method === method,
  )

const { adminToken } = useRuntimeConfig()

const isAdminTokenValid = (token: string) => token === adminToken

export default defineEventHandler((event) => {
  const currentUrl = event.node.req.url as string
  const currentMethod = event.node.req.method as string

  if (!currentUrl) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid URL',
    })
  }

  const token = String(event.node.req.headers.authorization).split(' ')[1]

  const shouldValidateToken = isRouteProtected(currentUrl, currentMethod)

  if (shouldValidateToken) {
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
  }
})
