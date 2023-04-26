<template>
  <main class="container max-w-sm px-4 py-12 mx-auto">
    <section
      v-for="(resource, resourceKey) in resources"
      :key="`resource-${resourceKey}`"
      class="mb-12"
    >
      <header class="mb-6 text-center text-gray-900">
        <span class="px-4 py-2 leading-5 bg-yellow-50">{{
          resource.title
        }}</span>
        <h2 class="block my-2 text-2xl font-extrabold leading-7 tracking-tight">
          {{ resource.label }}
        </h2>
        <p class="tracking-tight text-gray-500">
          {{ resource.description }}
        </p>
      </header>
      <BasePlaceCard
        v-for="(item, itemKey) in resource.places"
        :key="`item-${itemKey}`"
        :item="item"
      />
    </section>
  </main>
</template>

<script lang="ts" setup>
import { BasePlaceCard } from '#components'

type Avatar = {
  id: number
  name: string
  alternativeText: string
  url: string
}

type Media = {
  id: number
  alternativeText?: string
  url: string
}

type Place = {
  id: number
  title: string
  slug: string
  available: boolean
  description?: string
  avatar?: Avatar
  medias?: Media[]
}

type Places = Place[]

type Resource = {
  id: number
  title: string
  label: string
  description?: string
  places?: Places
}

type ResourcesResponse = {
  data: Resource[]
  meta: {
    pagination: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
}

const { data: resourcesResponse } = await useAsyncData<ResourcesResponse>(
  'resources',
  () => $fetch('/api/places'),
)

const resources = computed(() => {
  if (!resourcesResponse?.value) return []

  return resourcesResponse?.value?.data
})

// const { data } = await useFetch<ResourcesResponse>(`/api/resources`)

// const data = response.data?.data
</script>
