// categories.get.ts

// import * as qs from 'qs'
// import { ofetch } from 'ofetch'

// import type { StrapiCategoriesResponse } from '@/types/strapi'
import type { Category } from '@/types/nitro'

export default defineEventHandler(() => {
  // const runtimeConfig = useRuntimeConfig()

  // const fullUrl = (string = '') =>
  //   new URL(string, runtimeConfig?.public?.strapi?.url).toString()

  // const { data: strapiCategories } = await ofetch<StrapiCategoriesResponse>(
  //   fullUrl(`/api/categories?${qs.stringify({ sort: ['label:asc'] })}`),
  // )

  // // Convert StrapiCategoriesResponse to Category
  // const categories: Category[] = strapiCategories.map((category) => ({
  //   slug: category.attributes.slug,
  //   label: category.attributes.label,
  //   icon: category.attributes.icon,
  // }))

  const categories: Category[] = [
    { slug: 'churrascaria', label: 'Churrascaria', icon: '🥩' },
    { slug: 'hamburgueria', label: 'Hamburgueria', icon: '🍔' },
    { slug: 'japanese-food', label: 'Japanese Food', icon: '🍣' },
    { slug: 'pizzaria', label: 'Pizzaria', icon: '🍕' },
    { slug: 'sorveteria', label: 'Sorveteria', icon: '🍨' },
    { slug: 'doces-guloseimas', label: 'Doces & Guloseimas', icon: '🍫' },
    { slug: 'cafe-bistro', label: 'Café & Bistrô', icon: '☕️' },
  ]

  // Return Category
  return categories
})
