<template>
  <main>
    <div
      v-if="!searchTerm"
      class="container flex flex-col px-4 py-12 mx-auto gap-y-16"
    >
      <section
        v-for="(resource, resourceKey) in (resources as Resource[])"
        :key="`resource-${resourceKey}`"
      >
        <header class="mb-6 text-center text-gray-900">
          <span class="px-4 py-2 leading-5 rounded-full bg-yellow-50">{{
            resource.title
          }}</span>
          <h2
            class="block my-2 text-2xl font-extrabold leading-7 tracking-tight"
          >
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
    </div>
    <div v-else class="container flex flex-col px-4 py-12 mx-auto gap-y-12">
      <TheFilteringSearch />
      <section
        class="grid items-center justify-center grid-cols-1 gap-6 mx-auto md:grid-cols-2 xl:grid-cols-4 place-items-center max-w-fit"
      >
        <BasePlaceCard
          v-for="(item, itemKey) in resources"
          :key="`item-${itemKey}`"
          :item="(item as Place)"
        />
      </section>
    </div>
  </main>
</template>

<script lang="ts" setup>
import { BasePlaceCard } from '#components'
import type { ResourcesResponse, Place, Resource } from '@/types/nitro'

const search = reactive(useSearch())

const searchTerm = computed(() => search.term)

const { data: resourcesResponse, refresh } =
  await useAsyncData<ResourcesResponse>('resources', () =>
    $fetch(`/api/places`, { query: { q: search.term } }),
  )

const resources = computed(() => {
  if (!resourcesResponse?.value) return []

  return resourcesResponse?.value?.data
})

watch(
  () => search.term,
  () => {
    refresh()
  },
)
</script>
