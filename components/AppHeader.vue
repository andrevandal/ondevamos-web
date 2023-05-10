<template>
  <header
    :class="[
      'py-3 bg-gray-900',
      {
        'pb-6': !props.onlyNavigation,
      },
    ]"
  >
    <AppNavigation :user="user" />
    <BaseSection v-if="!props.onlyNavigation">
      <template #before>
        <BaseAd />
      </template>
      <div
        class="flex flex-col max-w-4xl gap-2 py-6 mx-auto text-center lg:py-10"
      >
        <h1
          class="text-2xl font-extrabold leading-7 tracking-tighter text-white lg:text-5xl lg:leading-[3.5rem]"
        >
          Explore os melhores lugares e encontre a experiência perfeita para
          você!
        </h1>
        <h2 class="text-gray-200 lg:text-2xl lg:leading-8">
          Planeje o seu próximo rolê na companhia que você gosta!
        </h2>
      </div>
      <template #after>
        <BaseSearch />
      </template>
    </BaseSection>
  </header>
</template>

<script lang="ts" setup>
import { AppNavigation, BaseSection, BaseAd, BaseSearch } from '#components'

type User = {
  id: string
  name: string
  profilePictureSrc: string
}

const props = defineProps({
  onlyNavigation: Boolean,
  user: {
    type: Object as PropType<User>,
    default: () => ({}),
  },
})
</script>

<style></style>
