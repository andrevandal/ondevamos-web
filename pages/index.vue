<template>
  <div>
    <h1 class="text-3xl font-bold underline">
      Hello world! <nuxt-icon name="thumbs-up" filled />
    </h1>
  </div>
</template>

<script lang="ts" setup>
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
