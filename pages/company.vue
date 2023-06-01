<template>
  <perfect-scrollbar>
    <article>
      <div class="flex flex-col">
        <header class="w-full mb-6">
          <img
            :src="place.cover.url"
            :alt="place.cover.alt"
            class="w-full h-auto"
          />
          <div
            class="relative rounded-full flex items-end gap-4 w-[100px] h-[100px] -translate-y-1/2 -mb-[50px] z-10 border-4 border-white ml-4"
          >
            <img
              :src="place.avatar"
              :alt="place.title"
              class="rounded-full"
              width="100"
              height="100"
            />
            <div
              :class="[
                'absolute bg-[#0D8047] w-5 h-5 border-2 border-white rounded-full bottom-0 right-0',
                {
                  hidden: !place.available,
                },
              ]"
            >
              <span class="sr-only">Opened</span>
            </div>
            <span class="h-9">
              Avaliação
              <BaseRating :level="place.rating" />
            </span>
            <span class="h-9">
              Preço
              <BasePriceLevel :level="place.price" />
            </span>
          </div>
        </header>
        <div class="px-4 pb-14">
          <h1 class="pb-2 text-2xl font-semibold leading-7 text-gray-900">
            {{ place.title }}
          </h1>
          <a
            href="#"
            class="text-blue text-sm block leading-4 max-w-[calc(100%-.5rem)] text-ellipsis overflow-hidden whitespace-nowrap pb-2"
            >{{ place.address }}</a
          >
          <div class="text-gray-500 text-xs space-x-2 pt-3">
            <span
              v-if="place.veganOptions"
              class="inline-flex items-center gap-1 px-3 py-1 border border-gray-100 rounded-full"
            >
              <NuxtIcon name="veggan" />
              <span>Opções Veganas</span>
              <NuxtIcon name="check" class="text-[#009959]" />
            </span>
            <span
              v-if="place.petFriendly"
              class="inline-flex items-center gap-1 px-3 py-1 border border-gray-100 rounded-full"
            >
              <NuxtIcon name="pet" />
              <span>Pet Friendly</span>
              <NuxtIcon name="check" class="text-[#009959]" />
            </span>
          </div>
          <div class="flex-col gap-1 py-4">
            <h2 class="font-bold leading-5 text-gray-900">Sobre</h2>
            <p class="leading-5 text-gray-500">{{ place.description }}</p>
          </div>
          <ul class="flex flex-row gap-1 mb-8">
            <li
              v-for="(action, index) in place.actions"
              :key="`action-${index}`"
            >
              <a
                href="#"
                :class="[
                  'inline-flex items-center gap-2 px-3 text-gray-900 rounded-lg',
                  { 'py-2 bg-yellow-500': !index, 'py-3 bg-gray-100': !!index },
                ]"
              >
                <NuxtIcon :name="action.icon" filled class="-mb-[.125em]" />
                <span
                  :class="{
                    'sr-only': !!index,
                  }"
                  >{{ action.label }}
                </span>
              </a>
            </li>
            <li>
              <a
                href="#"
                class="inline-flex items-center gap-2 px-3 py-3 text-gray-900 bg-gray-100 rounded-lg"
              >
                <NuxtIcon
                  name="curve-arrow-pointing-left"
                  filled
                  class="-mb-[.125em]"
                />
                <span class="sr-only">Compartilhar </span>
              </a>
            </li>
          </ul>
          <!-- Aberto agora-->
          <div class="relative">
            <section
              class="flex items-center justify-between gap-2 w-[342px] cursor-pointer"
              @click="toggleModal"
            >
              <span
                :class="[
                  'font-bold text-[#009959]',
                  { ['text-[#D44431]']: !place.openNow },
                ]"
                >{{ place.openNow ? 'Aberto Agora' : 'Fechado Agora' }}</span
              >
              <span>
                {{ place.openNow ? 'Fecha às' : 'Abre às' }} : uma hora ai
              </span>
              <button
                :class="[
                  'duration-300',
                  [openAtModalVisible ? '-rotate-180' : 'rotate-0'],
                ]"
              >
                <NuxtIcon name="chevron-down" class="w-4 h-4" />
              </button>
            </section>
            <ul
              v-if="openAtModalVisible"
              ref="openAtModalRef"
              class="absolute inset-x-0 p-4 flex flex-col gap-2 bg-white w-[342px] shadow-lg rounded-lg"
            >
              <li
                v-for="(hour, index) in place.openingHours"
                :key="index"
                class="flex py-2 px-4 bg-gray-50 rounded-lg"
              >
                <span class="flex-1 font-bold">
                  {{ hour.day }}
                </span>
                <span class="flex-1">
                  {{ hour.hour }}
                </span>
              </li>
            </ul>
          </div>
        </div>
        <BaseHorizontalScroll
          ref="scrollInstance"
          class="flex flex-row my-6 gap-2 overflow-x-scroll flex-nowrap scrollbar-hide cursor-grab lg:max-w-fit"
        >
          <template #default="{ isMouseDown }">
            <img
              v-for="(
                featuredMedia, featuredMediaIndex
              ) in place.featuredMedias"
              :key="`featured-media-index-${featuredMediaIndex}`"
              :src="featuredMedia.src"
              :alt="featuredMedia.alt"
              :class="[
                ['rounded snap-center first-of-type:ml-4 last-of-type:mr-4'],
                {
                  'cursor-grabbing': isMouseDown.value,
                },
              ]"
            />
          </template>
        </BaseHorizontalScroll>
        <div class="px-4 pb-14">
          <div class="flex flex-col gap-y-4">
            <h2 class="font-bold leading-5 text-gray-900">
              Principais atrações
            </h2>
            <ul class="flex flex-col">
              <li
                v-for="(attraction, attractionIndex) in place.mainAttractions"
                :key="`attraction-index-${attractionIndex}`"
                class="flex flex-row py-2 gap-x-4"
              >
                <img
                  :src="attraction.image.src"
                  :alt="attraction.image.alt"
                  width="64"
                  height="64"
                  class="w-[64] h-[64] aspect-square rounded"
                />
                <div class="flex flex-col justify-center pl-2 gap-y-1">
                  <h3 class="text-sm font-semibold text-gray-900">
                    {{ attraction.title }}
                  </h3>
                  <p class="text-sm text-gray-500">
                    {{ attraction.description }}
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </article>
  </perfect-scrollbar>
</template>

<script lang="ts">
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import { BaseHorizontalScroll } from '#components'
import { place } from '@/ex'
import 'vue3-perfect-scrollbar/dist/vue3-perfect-scrollbar.css'

export default defineComponent({
  components: {
    PerfectScrollbar,
  },
  props: {
    slug: {
      type: [String, Array, null] as PropType<String | String[] | null>,
      default: '',
    },
    // place: {
    //   type: [String, Array, null] as PropType<String | String[] | null>, TODO: precisa ser discutido
    //   default: '',
    //   requierd: true,
    // },
  },
  setup(_props) {
    const scrollInstance = ref<typeof BaseHorizontalScroll | null>(null)
    const openAtModalRef = ref<HTMLElement | null>(null)
    const openAtModalVisible = ref(false)

    const toggleModal = () => {
      openAtModalVisible.value = !openAtModalVisible.value
    }

    definePageMeta({
      layout: 'profile',
    })
    // https://schema.org/openingHours
    // Mo-Su 9:00-13:00 16:00-20:00
    return {
      place,
      toggleModal,
      openAtModalRef,
      openAtModalVisible,
      BaseHorizontalScroll,
      scrollInstance,
    }
  },
})
</script>

<style src="vue3-perfect-scrollbar/dist/vue3-perfect-scrollbar.css" />
