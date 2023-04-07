<script setup lang="ts">
import { BaseSearch } from '#components'

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

<template>
  <Story
    title="BaseSearch (mobile)"
    :layout="{
      type: 'grid',
      width: '640px',
    }"
  >
    <BaseSearch :resources="resources" />
  </Story>
</template>
