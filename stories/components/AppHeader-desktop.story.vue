<script lang="ts" setup>
import { AppHeader } from '#components'
const user = {
  id: '1',
  name: 'Suzana',
  profilePictureSrc: '/images/32.jpeg',
}
</script>

<template>
  <Story
    title="AppHeader (desktop)"
    :layout="{
      type: 'grid',
      width: '1024px',
    }"
  >
    <Variant title="Guest">
      <AppHeader />
    </Variant>
    <Variant title="Logged">
      <AppHeader :user="user" />
    </Variant>
    <Variant title="Guest (navigation only)">
      <AppHeader only-navigation />
    </Variant>
    <Variant title="Logged (navigation only)">
      <AppHeader :user="user" only-navigation />
    </Variant>
  </Story>
</template>
