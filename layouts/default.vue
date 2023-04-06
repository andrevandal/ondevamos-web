<template>
  <main>
    <AppHeader />
    <slot />
    <AppFooter />
  </main>
</template>

<script lang="ts" setup>
import { AppHeader } from '#components'

useHead({
  title: 'OndeVamos.app',
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
      href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap',
      crossorigin: 'anonymous',
    },
  ],
})
</script>
