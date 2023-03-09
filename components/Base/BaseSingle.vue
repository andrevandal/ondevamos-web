<template>
  <perfect-scrollbar class="max-h-[80vh]">
    <article>
      <div class="flex flex-col">
        <header class="w-full">
          <img :src="cover.url" :alt="cover.alt" class="w-full h-auto" />
          <div
            class="relative rounded-full w-[100px] h-[100px] -translate-y-1/2 z-10 border-4 border-white ml-4"
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
              <span class="sr-only">Opend</span>
            </div>
          </div>
        </header>
        <div>
          <h1 class="text-base font-medium leading-5 text-white">
            {{ title }}
          </h1>
          <a href="#">{{ address }}</a>
          <ul class="flex justify-center">
            <li>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="w-5 h-5 mr-1 text-warning"
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
                class="w-5 h-5 mr-1 text-warning"
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
                class="w-5 h-5 mr-1 text-warning"
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
                class="w-5 h-5 mr-1 text-warning"
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
                class="w-5 h-5 mr-1 text-warning"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                />
              </svg>
            </li>
          </ul>
          <div>
            <h2>Sobre</h2>
            <p>{{ description }}</p>
          </div>
          <ul>
            <li><a href="#">Como chegar</a></li>
            <li><a href="#">Instagram</a></li>
            <li><a href="#">Whatsapp</a></li>
            <li><a href="#">Share</a></li>
          </ul>
          <!-- Aberto agora-->

          <div>
            <img
              v-for="(featuredMedia, featuredMediaIndex) in featuredMedias"
              :key="`featured-media-index-${featuredMediaIndex}`"
              :src="featuredMedia.src"
              :alt="featuredMedia.alt"
            />
          </div>
          <div>
            <h2>Principais atrações</h2>
            <ul>
              <li
                v-for="(attraction, attractionIndex) in mainAttractions"
                :key="`attraction-index-${attractionIndex}`"
              >
                <img :src="attraction.image.src" :alt="attraction.image.alt" />
                <h3>{{ attraction.title }}</h3>
                <p>{{ attraction.description }}</p>
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
        url: 'https://via.placeholder.com/375x165.png',
        alt: '',
      },
      title: 'Dom Catulo Burguer',
      avatar: 'https://via.placeholder.com/100x100.png',
      available: true,
      address: 'Rod. Hélio Smidt, Check-in B - Aeroporto, Guarulhos - SP',
      description: 'Lorem ipsum dolor sit amet consectetur. Venenatis egestas.',
      rating: 5,
      featuredMedias: Array(3).fill({
        type: 'image',
        src: 'https://via.placeholder.com/270x338.png',
        alt: '',
      }),
      socialNetworks: [
        {
          type: 'instagram',
          label: '@pedrohenri.ms',
          url: 'https://www.instagram.com/pedrohenri.ms',
        },
        {
          type: 'whatsapp',
          label: '(44) 99144-1919',
          url: 'https://wa.me/+5544991441919',
        },
      ],
      mainAttractions: Array(2).fill({
        image: {
          src: 'https://via.placeholder.com/270x338.png',
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
