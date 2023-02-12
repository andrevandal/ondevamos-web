<template>
  <main class="container px-4 py-12 sm:px-6">
    <section
      v-for="(resource, resourceKey) in resources"
      :key="`resource-${resourceKey}`"
    >
      <header>
        <span>{{ resource.label }}</span>
        <h2>{{ resource.title }}</h2>
        <h3>{{ resource.description }}</h3>
      </header>
    </section>
  </main>
</template>

<script lang="ts" setup>
const resources = [
  {
    type: 'hamburgueria',
    label: 'Hamburgueria',
    title: 'Delícias de carne e sabores incríveis! 🤤',
    description: 'Aqui algumas recomendações de hamburguerias na cidade',
    items: Array(5).fill({
      slug: 'dom-catuto-burger',
      images: Array(5).fill({
        src: 'https://via.placeholder.com/1080x1350.png',
        alt: '',
      }),
    }),
  },
  {
    type: 'doces-guloseimas',
    label: 'Doces & Guloseimas',
    title: 'Delícias de carne e sabores incríveis! 🤤',
    description: 'Aqui algumas recomendações de hamburguerias na cidade',
  },
]

useHead({
  title: 'OndeVamos.app',
  meta: [
    {
      name: 'description',
      content: '',
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
      content: '',
    },
    {
      name: 'og:image',
      content: 'https://ondevamos.app/images/social/startup-digital.png',
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
      content: '',
    },
    {
      name: 'twitter:image',
      content: 'https://ondevamos.app/images/social/startup-digital.png',
    },
  ],
  link: [
    {
      rel: 'icon',
      type: 'image/x-icon',
      href: '/favicon.ico',
    },
    {
      rel: 'preconnect',
      href: 'https://fonts.googleapis.com',
    },
    {
      rel: 'preconnect',
      href: 'https://fonts.gstatic.com',
      crossorigin: 'anonymous',
    },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;700;900&display=swap',
      crossorigin: 'anonymous',
    },
  ],
  bodyAttrs: {
    class: 'font-poppins',
  },
})
</script>
