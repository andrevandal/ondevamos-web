<template>
  <perfect-scrollbar class="max-h-[80vh]">
    <article>
      <div class="flex flex-col">
        <header class="w-full mb-6">
          <img :src="cover.url" :alt="cover.alt" class="w-full h-auto" />
          <div
            class="relative rounded-full w-[100px] h-[100px] -translate-y-1/2 -mb-[50px] z-10 border-4 border-white ml-4"
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
          <ul class="flex text-yellow-500">
            <li>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="w-5 h-5 mr-1"
              >
                <path
                  fill-rule="evenodd"
                  d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                  clip-rule="evenodd"
                />
              </svg>
            </li>
            <li>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="w-5 h-5 mr-1"
              >
                <path
                  fill-rule="evenodd"
                  d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                  clip-rule="evenodd"
                />
              </svg>
            </li>
            <li>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="w-5 h-5 mr-1"
              >
                <path
                  fill-rule="evenodd"
                  d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                  clip-rule="evenodd"
                />
              </svg>
            </li>
            <li>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-5 h-5 mr-1"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                />
              </svg>
            </li>
            <li>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-5 h-5 mr-1"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                />
              </svg>
            </li>
          </ul>
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
    // https://schema.org/openingHours
    // Mo-Su 9:00-13:00 16:00-20:00
    return {
      cover: {
        url: '/images//375x165.png',
        alt: '',
      },
      title: 'Dom Catulo Burguer',
      avatar: '/images//100x100.png',
      available: true,
      address: 'Rod. Hélio Smidt, Check-in B - Aeroporto, Guarulhos - SP',
      description: 'Lorem ipsum dolor sit amet consectetur. Venenatis egestas.',
      rating: 5,
      featuredMedias: Array(3).fill({
        type: 'image',
        src: '/images//270x338.png',
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
      openingHours: ['Mo-Su 07:00-23:00'],
    }
  },
})
</script>

<style src="vue3-perfect-scrollbar/dist/vue3-perfect-scrollbar.css" />

<!-- <style>
.ps {
  height: calc(80vh-2.5rem);
}
</style> -->
