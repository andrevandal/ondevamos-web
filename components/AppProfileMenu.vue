<template>
  <div class="relative" ref="target">
    <a
      v-if="props.user?.id"
      href="#"
      class=" w-fit rounded-[2.5rem] p-1 pt-[calc(0.25rem-1px)] pl-1 lg:pl-4 gap-4 flex flex-row justify-end items-center box-border bg-white/5 border-t border-t-white/5 font-bold leading-5 text-white hover:bg-white/10 focus:bg-white/10"
      @click="close"
    >
      <span class="hidden ml-3 lg:block">
        {{ props.user.name }}
      </span>
      <img
        width="32"
        height="32"
        :src="props.user?.profilePictureSrc"
        class="rounded-full"
      />
    </a>
    <ul class="absolute flex flex-col w-64 bg-white rounded-lg p-2 gap-2 justify-center items-start shadow-[0_2px_8px_rgb(0,0,0,0.25)] right-0 top-[48px]" v-show="showMenu">
      <li class="w-full">
        <a href="#" class="flex flex-row items-center justify-between py-2 pl-4 pr-5 text-base text-gray-900 rounded-lg hover:bg-black/5"><span>Editar Perfil</span><NuxtIcon name="pencil-square" /></a>
      </li>
      <li class="w-full">
        <a class="flex flex-row items-center justify-between py-2 pl-4 pr-5 text-base text-gray-900 rounded-lg hover:bg-black/5" href="#"><span>Permissões</span></a>
      </li>
      <li class="w-full">
        <a class="flex flex-row items-center justify-between py-2 pl-4 pr-5 text-base text-gray-900 rounded-lg hover:bg-black/5" href="#"><span>Adicionar empresa</span></a>
      </li>
      <li class="w-full">
        <a class="flex flex-row items-center justify-between py-2 pl-4 pr-5 text-base text-gray-900 rounded-lg hover:bg-black/5" href="#"><span>Meus empreendimentos</span></a>
      </li>
      <li class="w-full pt-2 border-t border-t-gray-200">
        <a class="flex flex-row items-center justify-between py-2 pl-4 pr-5 text-base text-gray-900 rounded-lg hover:bg-black/5" href="#"><span>Sair</span></a>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { NuxtIcon } from '#components'

const showMenu = ref(false)

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

const close = () => {
  showMenu.value = !showMenu.value
}
const target = ref(null)
onClickOutside(target, () => {
  if(!showMenu.value){
    return
  }
  close()
})
</script>
