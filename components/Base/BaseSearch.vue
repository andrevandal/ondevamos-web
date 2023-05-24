<template>
  <div class="flex flex-col gap-y-6">
    <div class="container mx-auto">
      <form
        class="flex items-stretch max-w-full mx-4 border-2 justify-stretch lg:max-w-lg lg:mx-auto border-white/25 rounded-[.5rem]"
        :class="{ 'border-yellow-500': searchTerm }"
        @submit="doSearch"
      >
        <input
          v-model="searchTerm"
          type="search"
          class="z-10 w-auto col-start-1 col-end-2 pl-6 py-3 font-medium leading-5 text-gray-900 bg-white rounded-l-[.4rem] outline-none placeholder:text-gray-400 flex-1"
          placeholder="Onde vamos hoje? 🤭"
        />
        <button
          type="submit"
          class="z-10 col-start-2 col-end-3 px-6 py-3 bg-white rounded-r-[.4rem]"
        >
          🔍
        </button>
      </form>
    </div>
    <PillsList v-if="resources?.length" :resources="resources" />
  </div>
</template>

<script lang="ts" setup>
import useSearch from '~/composables/useSearch'

type Resource = {
  slug: string
  label: string
  icon: string
}

const { data: resources } = await useFetch<Resource[]>(() => `/api/categories`)

const search = useSearch()
const searchTerm = ref(search.term.value)

watch(search.term, () => {
  searchTerm.value = search.term.value
})

const doSearch = (event: Event) => {
  event.preventDefault()
  const term = (
    (event.target as HTMLFormElement).querySelector(
      'input[type="search"]',
    ) as HTMLInputElement
  )?.value

  search.update(term)
}
</script>
