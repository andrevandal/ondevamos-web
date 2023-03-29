<template>
  <main class="container max-w-sm px-4 py-12 mx-auto">
    <section
      v-for="(resource, resourceKey) in resources?.data"
      :key="`resource-${resourceKey}`"
      class="mb-12"
    >
      <header class="mb-6 text-center text-gray-800">
        <span class="px-4 py-2 leading-5 bg-orange-50">{{
          resource.attributes?.title
        }}</span>
        <h2 class="block my-2 text-2xl font-extrabold leading-7 tracking-tight">
          {{ resource.attributes?.label }}
        </h2>
        <p class="tracking-tight text-gray-500">
          {{ resource.attributes?.description }}
        </p>
      </header>
      <article
        v-for="(item, itemKey) in resource.attributes.places.data"
        :key="`item-${itemKey}`"
        class="relative mb-4 last-of-type:mb-0"
      >
        <div
          v-if="!item.attributes.medias?.data?.length"
          class="relative rounded-lg"
        >
          <img
            v-if="!item?.attributes.medias?.data?.length"
            :src="fullUrl(item.attributes.avatar.data.attributes.url)"
            :alt="item.attributes.avatar.data.attributes.alternativeText"
            class="object rounded-2xl aspect-[1080/1350]"
            width="1080"
            height="1350"
          />
          <div
            class="absolute top-0 bottom-0 left-0 right-0 rounded-lg bg-white/20 backdrop-blur mix-blend-normal"
          ></div>
          <div
            class="absolute top-0 bottom-0 left-0 right-0 flex flex-col items-center justify-center p-4 text-base leading-5 text-center rounded-lg bg-white/40"
          >
            <div class="relative rounded-full">
              <img
                :src="fullUrl(item.attributes.avatar.data.attributes.url)"
                :alt="item.attributes.avatar.data.attributes.alternativeText"
                class="rounded-full"
                width="64"
                height="64"
              />
              <div
                :class="[
                  'absolute bg-[#0D8047] w-3 h-3 border-2 border-white rounded-full bottom-0 right-0',
                  {
                    hidden: !item.attributes.available,
                  },
                ]"
              >
                <span class="sr-only">Opend</span>
              </div>
            </div>
            <h3 class="mt-4 font-bold text-gray-800">
              {{ item.attributes.title }}
            </h3>
            <span class="text-gray-600">
              {{ item.attributes.description }}
            </span>
          </div>
        </div>
        <div v-else :class="['relative rounded-2xl bg-white/80']">
          <img
            v-for="(image, imageKey) in item.attributes.medias?.data"
            :key="`image-${imageKey}`"
            :src="fullUrl(image.attributes.url)"
            :alt="image.attributes.alternativeText"
            class="rounded-2xl aspect-[1080/1350]"
            width="1080"
            height="1350"
          />
        </div>
        <NuxtLink
          :href="`/${item.attributes.slug}/`"
          :class="[
            'absolute inline-flex items-center gap-2 p-2 m-1 transition-all ease-in-out bottom-1 left-1 right-1 backdrop-blur rounded-xl bg-gray-800/80 border-t-white/20 ring-3 ring-transparent hover:ring-white/25 hover:bg-gray-800/90',
            {
              'text-center justify-center py-5':
                !item?.attributes.medias?.data?.length,
            },
          ]"
        >
          <div
            v-if="!!item?.attributes.medias?.data?.length"
            class="relative rounded-full"
          >
            <img
              :src="fullUrl(item.attributes.avatar.data.attributes.url)"
              :alt="item.attributes.avatar.data.attributes.alternativeText"
              class="rounded-full"
              width="40"
              height="40"
            />
            <div
              :class="[
                'absolute bg-[#0D8047] w-3 h-3 border-2 border-white rounded-full bottom-0 right-0',
                {
                  hidden: !item.attributes.available,
                },
              ]"
            >
              <span class="sr-only">Opened</span>
            </div>
          </div>
          <h3 class="text-base font-medium leading-5 text-white">
            {{
              !item.attributes.medias?.data?.length
                ? 'Ver mais'
                : item.attributes.title
            }}
          </h3>
        </NuxtLink>
      </article>
    </section>
    <Teleport to="body">
      <BaseModal v-model="shouldShowSwipeModal" @close="onClose">
        <BaseSingle :slug="slug" />
      </BaseModal>
    </Teleport>
  </main>
</template>

<script lang="ts" setup>
// import consola from 'consola'
import * as qs from 'qs'

import { useRouteParams } from '@vueuse/router'
const runtimeConfig = useRuntimeConfig()

const fullUrl = (string: string) =>
  new URL(string, runtimeConfig.strapi.url).toString()

// const { find } = useStrapi()

type StrapiMediaFormatsContent = {
  ext: string
  url: string
  hash: string
  mime: string
  name: string
  path: string
  size: number
  width: number
  height: number
}

type StrapiMediaFormats = {
  large: StrapiMediaFormatsContent
  small: StrapiMediaFormatsContent
  medium: StrapiMediaFormatsContent
  thumbnail: StrapiMediaFormatsContent
}

type StrapiPlaces = {
  data: {
    id: number
    attributes: {
      title: string
      slug: string
      available: boolean
      description: string
      createdAt: string
      updatedAt: string
      publishedAt: string
      avatar: {
        data: {
          id: 1
          attributes: {
            name: string
            alternativeText: string
            caption: string
            width: number
            height: number
            formats: any
            hash: string
            ext: string
            mime: string
            size: number
            url: string
            previewUrl: string
            provider: string
            provider_metadata: any
            createdAt: string
            updatedAt: string
          }
        }
      }
      medias: {
        data: {
          id: number
          attributes: {
            name: string
            alternativeText?: string
            caption?: string
            width: number
            height: number
            formats: StrapiMediaFormats
            hash: string
            ext: string
            mime: string
            size: number
            url: string
            previewUrl: string
            provider: string
            provider_metadata: any
            createdAt: string
            updatedAt: string
          }
        }[]
      }
    }
  }[]
}

type StrapiApiResources = {
  data: {
    id: number
    attributes: {
      slug: string
      title: string
      label: string
      description: string
      createdAt: string
      updatedAt: string
      places: StrapiPlaces
    }
  }[]
  meta: {
    pagination: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
}

const { data: resources } = await useFetch<StrapiApiResources>(
  fullUrl(
    `/api/resources?${qs.stringify(
      {
        sort: ['title:asc'],
        populate: {
          places: {
            populate: ['avatar', 'medias'],
          },
        },
      },
      {
        encodeValuesOnly: true, // prettify URL
      },
    )}`,
  ),
)

useHead({
  title: 'OndeVamos.app',
  meta: [
    {
      name: 'description',
      content:
        'Explore os melhores lugares e encontre a experiência perfeita para você!',
    },
    {
      name: 'og:type',
      content: 'website',
    },
    {
      name: 'og:url',
      content: 'https://ondevamos.app/',
    },
    {
      name: 'og:title',
      content: 'OndeVamos.app',
    },
    {
      name: 'og:description',
      content:
        'Explore os melhores lugares e encontre a experiência perfeita para você!',
    },
    {
      name: 'og:image',
      content: 'https://ondevamos.app/images/social.png',
    },
    {
      name: 'twitter:card',
      content: 'summary_large_image',
    },
    {
      name: 'twitter:url',
      content: 'https://ondevamos.app/',
    },
    {
      name: 'twitter:title',
      content: 'OndeVamos.app',
    },
    {
      name: 'twitter:description',
      content:
        'Explore os melhores lugares e encontre a experiência perfeita para você!',
    },
    {
      name: 'twitter:image',
      content: 'https://ondevamos.app/images/social.png',
    },
  ],
})

const slug = await useRouteParams('slug')

const shouldShowSwipeModal = ref(!!slug.value || false)

const router = useRouter()

const onClose = () => {
  return router.push({
    path: '/',
  })
}
</script>
