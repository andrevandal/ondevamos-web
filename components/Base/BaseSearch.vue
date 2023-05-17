<template>
  <div class="flex flex-col gap-y-6">
    <div class="container mx-auto">
      <form
        class="flex items-stretch max-w-full mx-4 border-2 justify-stretch lg:max-w-lg lg:mx-auto border-white/25 rounded-[.5rem]"
        :class="{ 'border-yellow-500': searchTerm }"
        @submit="search"
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
    <PillsList :resources="resources" />
  </div>
</template>

<script lang="ts" setup>
const { data: resources } = await useFetch(() => `/api/categories`)
const router = useRouter()
const route = useRoute()

const searchTerm = ref(String(route.query?.q ?? ''))

watch(
  () => route.query,
  () => (searchTerm.value = String(route.query?.q ?? '')),
)

const search = (event: Event) => {
  event.preventDefault()
  const searchTerm = (
    (event.target as HTMLFormElement).querySelector(
      'input[type="search"]',
    ) as HTMLInputElement
  )?.value
  if (searchTerm) {
    router.push({ query: { q: searchTerm } })
  } else {
    router.push({ query: {} })
  }
}
</script>
