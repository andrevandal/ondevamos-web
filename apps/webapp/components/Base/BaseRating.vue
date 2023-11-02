<template>
  <div class="rating-stars">
    <NuxtIcon
      v-for="(star, index) in starsArray"
      :key="index"
      :name="star"
      :filled="true"
    />
  </div>
</template>

<script setup lang="ts">
import { NuxtIcon } from '#components'

const props = defineProps({
  level: {
    type: Number,
    validator: (value: number) => value % 0.5 === 0 && value >= 0 && value <= 5,
    default: 0,
  },
})

const starsArray = computed(() => {
  const numberOfFullStars = Math.floor(props.level)
  const hasHalfStar = props.level % 1 !== 0

  return Array.from({ length: 5 }, (_, index) => {
    if (index < numberOfFullStars) {
      return 'rating-star-full'
    }
    if (index === numberOfFullStars && hasHalfStar) {
      return 'rating-star-half'
    }
    return 'rating-star-empty'
  })
})
</script>

<style scoped>
.rating-stars {
  @apply flex flex-row;
}
</style>
