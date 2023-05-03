// categories.get.ts

import * as qs from 'qs'
import { ofetch } from 'ofetch'

type StrapiCategoryAttributes = {
  label: string
  slug: string
  createdAt: string
  updatedAt: string
  publishedAt: string
  icon: string
}

type StrapiCategoryData = {
  id: number
  attributes: StrapiCategoryAttributes
}[]

type StrapiCategoriesResponse = {
  data: StrapiCategoryData
}

type Category = {
  slug: string
  label: string
  icon: string
}

export default defineEventHandler(async () => {
  const runtimeConfig = useRuntimeConfig()

  const fullUrl = (string = '') =>
    new URL(string, runtimeConfig?.public?.strapi?.url).toString()

  const { data: strapiCategories } = await ofetch<StrapiCategoriesResponse>(
    fullUrl(`/api/categories?${qs.stringify({ sort: ['label:asc'] })}`),
  )

  // Convert StrapiCategoriesResponse to Category
  const categories: Category[] = strapiCategories.map((category) => ({
    slug: category.attributes.slug,
    label: category.attributes.label,
    icon: category.attributes.icon,
  }))

  // Return Category
  return categories
})
