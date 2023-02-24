<template>
  <div class="flex flex-col gap-y-6">
    <form
      class="flex items-stretch justify-between before:rounded-lg p-[.2rem] before:absolute before:top-0 before:bottom-0 before:left-0 before:right-0 relative before:z-0 before:bg-gradient-to-r before:from-[#FBAD3F]/75 before:to-[#FF8157]/75 focus-within:before:before:from-[#FBAD3F]/90 focus-within:before:before:to-[#FF8157]/90 max-w-full"
    >
      <input
        type="search"
        class="z-10 w-auto col-start-1 col-end-2 pl-6 py-3 font-medium leading-5 text-gray-800 bg-white rounded-l-lg outline-none placeholder:text-gray-400 flex-1 max-w-[calc(100%-68px)]"
        placeholder="Onde vamos hoje? 🤭"
      />
      <button type="submit" class="z-10 col-start-2 col-end-3 px-6 py-3 bg-white rounded-r-lg">
        🔍
      </button>
    </form>
    <PillsList :resources="resources"/>
  </div>
</template>

<script lang="ts" setup>
const resources = [
  {
    slug: 'hamburgueria',
    label: 'Hamburgueria',
    icon: 'resources/hamburgueria',
  },
  {
    slug: 'sorveteria',
    label: 'Sorveteria',
    icon: 'resources/sorveteria',
  },
  {
    slug: 'churrascaria',
    label: 'Churrascaria',
    icon: 'resources/churrascaria',
  },
  {
    slug: 'japanese-food',
    label: 'Japanese Food',
    icon: 'resources/japanese-food',
  },
  {
    slug: 'pizzaria',
    label: 'Pizzaria',
    icon: 'resources/pizzaria',
  },
  {
    slug: 'more',
    label: 'Mais',
    icon: 'more-horizontal',
  },
]
</script>
