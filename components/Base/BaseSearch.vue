<template>
  <div class="flex flex-col gap-y-6">
    <form
      class="flex items-stretch justify-between before:rounded-lg p-[.2rem] before:absolute before:top-0 before:bottom-0 before:left-0 before:right-0 relative before:z-0 before:bg-gradient-to-r before:from-[#FBAD3F]/75 before:to-[#FF8157]/75 focus-within:before:before:from-[#FBAD3F]/90 focus-within:before:before:to-[#FF8157]/90"
    >
      <input
        type="search"
        class="z-10 flex-1 px-6 py-3 font-medium leading-5 text-gray-800 bg-white rounded-l-lg outline-none placeholder:text-gray-400"
        placeholder="Onde vamos hoje? 🤭"
      />
      <button type="submit" class="z-10 px-6 py-3 bg-white rounded-r-lg">
        🔍
      </button>
    </form>
    <ul class="flex flex-row gap-2 overflow-hidden">
      <li
        v-for="(resource, resourceKey) in resources"
        :key="`resource-${resourceKey}`"
      >
        <a
          href="#"
          class="inline-flex items-center gap-3 px-4 py-2 text-white border-t border-white rounded-lg border-opacity-5 bg-opacity-5 whitespace-nowrap bg-gradient-to-r from-white/5 to-white/5 hover:from-[#FBAD3F]/10 hover:to-[#FF8157]/10 transition-all duration-500 ease-in-out"
        >
          <NuxtIcon :name="resource.icon" />
          <span>{{ resource.label }}</span>
        </a>
      </li>
    </ul>
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
