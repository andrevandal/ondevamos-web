<template>
  <article class="relative block w-[266px] h-[335px]">
    <div v-if="!hasMedias" class="relative rounded-lg thumbnail-box">
      <img
        v-if="!hasMedias"
        :src="itemAvatarUrl"
        :alt="itemAvatarAltText"
        class="item-thumbnail object rounded-2xl aspect-[1080/1350]"
        width="1080"
        height="1350"
      />
      <div
        class="absolute top-0 bottom-0 left-0 right-0 rounded-lg overlay-blur bg-white/20 backdrop-blur mix-blend-normal"
      ></div>
      <div
        class="absolute top-0 bottom-0 left-0 right-0 flex flex-col items-center justify-center p-4 text-base leading-5 text-center rounded-lg thumbnail-content bg-white/40 gap-y-2"
      >
        <div class="relative rounded-full avatar-box">
          <img
            :src="itemAvatarUrl"
            :alt="itemAvatarAltText"
            class="rounded-full"
            width="64"
            height="64"
          />
          <div :class="availabilityClass">
            <span class="sr-only">Opened</span>
          </div>
        </div>
        <h3 class="mt-4 font-bold text-gray-900">{{ itemTitle }}</h3>
        <div class="flex flex-row gap-x-2">
          <BaseRating v-if="item.ratingLevel" :level="item.ratingLevel" />
          <BasePriceLevel v-if="item.priceLevel > 0" :level="item.priceLevel" />
        </div>
        <span class="text-gray-600">{{ itemDescription }}</span>
      </div>
    </div>
    <div v-else :class="['image-gallery relative rounded-2xl bg-white/80']">
      <img
        v-for="(image, imageKey) in [itemMedias[0]]"
        :key="`image-${imageKey}`"
        :src="image.url"
        :alt="image.alternativeText"
        class="image-item rounded-2xl aspect-[1080/1350]"
        width="1080"
        height="1350"
      />
    </div>
    <NuxtLink :to="itemLink" :class="nuxtLinkClass">
      <div v-if="hasMedias" class="relative rounded-full link-avatar-box">
        <img
          :src="itemAvatarUrl"
          :alt="itemAvatarAltText"
          class="rounded-full"
          width="40"
          height="40"
          draggable="false"
        />
        <div :class="availabilityClass">
          <span class="sr-only">Opened</span>
        </div>
      </div>
      <div>
        <h3 class="text-base font-medium leading-5 text-white link-title">
          {{ nuxtLinkLabel }}
        </h3>
        <div
          v-if="hasMedias && (item.ratingLevel || item.priceLevel)"
          class="flex flex-row mt-1 gap-x-2"
        >
          <BaseRating v-if="item.ratingLevel" :level="item.ratingLevel" />
          <BasePriceLevel v-if="item.priceLevel" :level="item.priceLevel" />
        </div>
      </div>
    </NuxtLink>
  </article>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

type Avatar = {
  id: number
  name: string
  alternativeText: string
  url: string
}

type Media = {
  id: number
  alternativeText?: string
  url: string
}

type Place = {
  id: number
  title: string
  slug: string
  available: boolean
  description?: string
  avatar?: Avatar
  medias?: Media[]
  ratingLevel: number
  priceLevel: number
}

const props = defineProps({
  item: {
    type: Object as PropType<Place>,
    default: () => ({} as Place),
  },
})

const itemAvatarUrl = computed(() => props.item.avatar?.url || '')
const itemAvatarAltText = computed(
  () => props.item.avatar?.alternativeText || '',
)
const itemTitle = computed(() => props.item.title || '')
const itemDescription = computed(() => props.item.description || '')
const itemMedias = computed(() => props.item.medias || [])
const itemLink = computed(() => `/${props.item.slug}/`)

const hasMedias = computed(() => !!itemMedias.value.length)
const nuxtLinkLabel = computed(() =>
  !hasMedias.value ? 'Ver mais' : itemTitle.value,
)

const availabilityClass = computed(() => {
  return [
    'availability-dot absolute bg-[#0D8047] w-3 h-3 border-2 border-white rounded-full bottom-0 right-0',
    {
      hidden: !props.item.available,
    },
  ]
})

const nuxtLinkClass = computed(() => {
  return [
    'nuxt-link absolute inline-flex items-center gap-2 p-2 m-1 transition-all ease-in-out bottom-1 left-1 right-1 backdrop-blur rounded-xl bg-gray-900/80 border-t-white/20 ring-3 ring-transparent hover:ring-white/25 hover:bg-gray-900/90',
    {
      'text-center justify-center py-5': !hasMedias.value,
    },
  ]
})
</script>
