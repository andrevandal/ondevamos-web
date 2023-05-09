<template>
  <div class="flex flex-col gap-y-6">
    <div class="container mx-auto">
      <form
        class="flex items-stretch justify-stretch before:rounded-lg p-[.2rem] before:absolute before:top-0 before:bottom-0 before:left-0 before:right-0 relative before:z-0 before:bg-gradient-to-r before:from-[#FBAD3F]/75 before:to-[#FF8157]/75 focus-within:before:before:from-[#FBAD3F]/90 focus-within:before:before:to-[#FF8157]/90 max-w-full mx-4 lg:max-w-lg lg:mx-auto"
      >
        <input
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
</script>
