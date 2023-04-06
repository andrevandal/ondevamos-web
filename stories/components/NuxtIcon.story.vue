<script lang="ts" setup>
import consola from 'consola'
import { NuxtIcon } from '#components'

const iconsImport = import.meta.glob('assets/icons/**/**.svg', {
  as: 'raw',
  eager: false,
})

const variants = Object.keys(iconsImport)
  .map((key) => String(key).replace('/assets/icons/', '').replace('.svg', ''))
  .entries()

consola.log(variants)
</script>

<template>
  <Story
    title="NuxtIcon"
    :layout="{
      type: 'grid',
    }"
  >
    <Variant v-for="[key, variant] of variants" :key="key" :title="variant">
      <NuxtIcon :name="variant" class="text-2xl" />
    </Variant>
  </Story>
</template>
