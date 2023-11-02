<template>
  <div class="price-levels">
    <NuxtIcon v-for="number in level" :key="number" name="price-level" />
  </div>
</template>

<script setup lang="ts">
import { NuxtIcon } from '#components'

defineProps({
  level: {
    type: Number,
    validator: (value: number) =>
      Number.isInteger(value) && value >= 0 && value <= 5,
    default: 0,
  },
})
</script>

<style scoped>
.price-levels {
  @apply flex flex-row text-[#009959];
}
</style>
