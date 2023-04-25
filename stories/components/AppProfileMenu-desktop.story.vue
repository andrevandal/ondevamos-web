<script lang="ts" setup>
import { AppProfileMenu } from '#components'

const user = {
  id: '1',
  name: 'Suzana',
  profilePictureSrc: '/images/32.jpeg',
}
</script>

<template>
  <Story
    title="AppProfileMenu (desktop)"
    :layout="{
      type: 'grid',
      width: '1024px',
    }"
  >
    <Variant title="Guest">
      <AppProfileMenu />
    </Variant>
    <Variant title="Logged">
      <AppProfileMenu :user="user" />
    </Variant>
  </Story>
</template>
