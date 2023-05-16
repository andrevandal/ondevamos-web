<template>
  <main class="container flex flex-col px-4 py-12 mx-auto gap-y-12">
    <section
      v-for="(resource, resourceKey) in resources"
      :key="`resource-${resourceKey}`"
    >
      <header class="mb-6 text-center text-gray-900">
        <span class="px-4 py-2 leading-5 rounded-full bg-yellow-50">{{
          resource.title
        }}</span>
        <h2 class="block my-2 text-2xl font-extrabold leading-7 tracking-tight">
          {{ resource.label }}
        </h2>
        <p class="tracking-tight text-gray-500">
          {{ resource.description }}
        </p>
      </header>
      <div
        class="grid items-center justify-center grid-cols-1 gap-6 mx-auto md:grid-cols-2 xl:grid-cols-4 place-items-center max-w-fit"
      >
        <BasePlaceCard
          v-for="(item, itemKey) in resource.places"
          :key="`item-${itemKey}`"
          :item="item"
        />
      </div>
    </section>
  </main>
</template>

<script lang="ts" setup>
import { BasePlaceCard } from '#components'

import type { ResourcesResponse } from '@/types/nitro'

const { data: resourcesResponse } = await useAsyncData<ResourcesResponse>(
  'resources',
  () => $fetch('/api/places'),
)

const resources = computed(() => {
  if (!resourcesResponse?.value) return []

  return resourcesResponse?.value?.data
})
</script>
