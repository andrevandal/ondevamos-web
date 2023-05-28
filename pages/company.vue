<template>
  <perfect-scrollbar>
    <article>
      <div class="flex flex-col">
        <header class="w-full mb-6">
          <img :src="cover.url" :alt="cover.alt" class="w-full h-auto" />
          <div
            class="relative rounded-full flex items-end gap-4 w-[100px] h-[100px] -translate-y-1/2 -mb-[50px] z-10 border-4 border-white ml-4"
          >
            <img
              :src="avatar"
              :alt="title"
              class="rounded-full"
              width="100"
              height="100"
            />
            <div
              :class="[
                'absolute bg-[#0D8047] w-5 h-5 border-2 border-white rounded-full bottom-0 right-0',
                {
                  hidden: !available,
                },
              ]"
            >
              <span class="sr-only">Opened</span>
            </div>
            <span class="h-9">
              Avaliação
              <BaseRating :level="rating" />
            </span>
            <span class="h-9">
              Preço
              <BasePriceLevel :level="price" />
            </span>
          </div>
        </header>
        <div class="px-4 pb-14">
          <h1 class="pb-2 text-2xl font-semibold leading-7 text-gray-900">
            {{ title }}
          </h1>
          <a
            href="#"
            class="text-blue text-sm block leading-4 max-w-[calc(100%-.5rem)] text-ellipsis overflow-hidden whitespace-nowrap pb-2"
            >{{ address }}</a
          >
          <div class="text-gray-500 text-xs space-x-2 pt-3">
            <span
              v-if="veganOptions"
              class="inline-flex items-center gap-1 px-3 py-1 border border-gray-100 rounded-full"
            >
              <NuxtIcon name="veggan" />
              <span>Opções Veganas</span>
              <NuxtIcon name="check" class="text-[#009959]" />
            </span>
            <span
              v-if="petFriendly"
              class="inline-flex items-center gap-1 px-3 py-1 border border-gray-100 rounded-full"
            >
              <NuxtIcon name="pet" />
              <span>Pet Friendly</span>
              <NuxtIcon name="check" class="text-[#009959]" />
            </span>
          </div>
          <div class="flex-col gap-1 py-4">
            <h2 class="font-bold leading-5 text-gray-900">Sobre</h2>
            <p class="leading-5 text-gray-500">{{ description }}</p>
          </div>
          <ul class="flex flex-row gap-1 mb-8">
            <li v-for="(action, index) in actions" :key="`action-${index}`">
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
            <section class="flex items-center justify-between gap-2 w-[342px]">
              <span
                :class="[
                  'font-bold text-[#009959]',
                  { ['text-[#D44431]']: !openNow },
                ]"
                >{{ openNow ? 'Aberto Agora' : 'Fechado Agora' }}</span
              >
              <span>
                {{ openNow ? 'Fecha às' : 'Abre às' }} : uma hora ai
              </span>
              <button @click="toggleModal">
                <NuxtIcon
                  name="chevron-down"
                  :class="['w-4 h-4', { ['-rotate-180']: openAtModalVisible }]"
                />
              </button>
            </section>
            <ul
              v-if="openAtModalVisible"
              ref="openAtModalRef"
              class="absolute inset-x-0 p-4 flex flex-col gap-2 bg-white w-[342px] shadow-lg rounded-lg"
            >
              <li
                v-for="(hour, index) in openingHours"
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

          <div
            class="flex flex-row py-8 overflow-hidden gap-x-3 flex-nowrap snap-x snap-proximity"
          >
            <img
              v-for="(featuredMedia, featuredMediaIndex) in featuredMedias"
              :key="`featured-media-index-${featuredMediaIndex}`"
              :src="featuredMedia.src"
              :alt="featuredMedia.alt"
            />
          </div>
          <div class="flex flex-col gap-y-4">
            <h2 class="font-bold leading-5 text-gray-900">
              Principais atrações
            </h2>
            <ul class="flex flex-col">
              <li
                v-for="(attraction, attractionIndex) in mainAttractions"
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
  },
  setup(_props) {
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
      cover: {
        url: '/images/375x165.png',
        alt: '',
      },
      title: 'Dom Catulo Burguer',
      avatar: '/images/100x100.png',
      available: true,
      address: 'Rod. Hélio Smidt, Check-in B - Aeroporto, Guarulhos - SP',
      description: 'Lorem ipsum dolor sit amet consectetur. Venenatis egestas.',
      rating: 3,
      price: 3,
      veganOptions: true,
      petFriendly: true,
      featuredMedias: Array(3).fill({
        type: 'image',
        src: '/images/270x338.png',
        alt: '',
      }),
      actions: [
        {
          icon: 'map-pin-outline',
          label: 'Como chegar',
          href: 'https://www.google.com/maps?q=',
        },
        {
          icon: 'instagram',
          label: '@pedrohenri.ms',
          href: 'https://www.instagram.com/pedrohenri.ms',
        },
        {
          icon: 'whatsapp',
          label: '(44) 99144-1919',
          href: 'https://wa.me/+5544991441919',
        },
      ],
      mainAttractions: Array(2).fill({
        image: {
          src: '/images/270x338.png',
          alt: '',
        },
        title: 'Deliciosos Cookies',
        description: 'A partir de R$00,00',
      }),
      openNow: false,
      openingHours: [
        { day: 'Segunda-feira', hour: '07:00-23:00' },
        { day: 'Terça-feira', hour: '07:00-23:00' },
        { day: 'Quarta-feira', hour: '07:00-23:00' },
        { day: 'Quinta-feira', hour: '07:00-23:00' },
      ],
      toggleModal,
      openAtModalRef,
      openAtModalVisible,
    }
  },
})
</script>

<style src="vue3-perfect-scrollbar/dist/vue3-perfect-scrollbar.css" />
