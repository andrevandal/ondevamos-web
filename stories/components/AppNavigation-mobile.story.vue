<script lang="ts" setup>
import { AppNavigation } from '#components'
const user = {
  id: '1',
  name: 'Suzana',
  profilePictureSrc: '/images/32.jpeg',
}
</script>

<template>
  <Story
    title="AppNavigation (mobile)"
    :layout="{
      type: 'grid',
      width: '640px',
    }"
  >
    <Variant title="Guest">
      <AppNavigation />
    </Variant>
    <Variant title="Logged">
      <AppNavigation :user="user" />
    </Variant>
  </Story>
</template>
