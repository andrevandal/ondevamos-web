<template>
  <nav class="container flex flex-row items-center justify-between px-4 mx-auto gap-x-8">
    <a href="/" class="">
      <span class="sr-only">ondevamos.app</span>
      <img src="/images/logo-light.svg" class="w-auto h-10" height="40" />
    </a>
    <ul class="items-center justify-center hidden ml-auto lg:flex gap-x-2">
      <li class="w-fit">
        <a href="https://www.instagram.com/ondevamos.app/" class="w-fit rounded-[2.5rem] p-[0.625rem] pt-[calc(0.625rem-1px)] flex flex-row justify-center items-center box-border bg-white/5 border-t border-t-white/5 font-bold  text-white hover:bg-white/10 focus:bg-white/10 text-xl leading-5" target="_blank">
          <NuxtIcon name="instagram" class="w-5 h-5 " />
        </a>
      </li>
      <li>
        <a href="https://www.facebook.com/ondevamosapp" class="w-fit rounded-[2.5rem] p-[0.625rem] pt-[calc(0.625rem-1px)] flex flex-row justify-center items-center box-border bg-white/5 border-t border-t-white/5 font-bold text-xl leading-5 text-white hover:bg-white/10 focus:bg-white/10" target="_blank">
          <NuxtIcon name="facebook" />
        </a>
      </li>
    </ul>
    <div>
      <AppProfileMenu v-if="props.user?.id" :user="props.user" />
      <BaseButton v-else variant="primary" outlined href="#">
        <span>Entrar</span>
      </BaseButton>
    </div>
  </nav>
</template>

<script lang="ts" setup>
import { AppProfileMenu, BaseButton, NuxtIcon } from '#components'

type User = {
  id: string
  name: string
  profilePictureSrc: string
}

const props = defineProps({
  user: {
    type: Object as PropType<User>,
    default: () => ({}),
  },
})
</script>
