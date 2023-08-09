<template>
  <main class="h-full w-full max-h-full max-w-full relative">
    <div class="background">
      <picture>
        <source
          media="(min-width: 641px)"
          srcset="/images/foto-pre-lancamento-min.png"
        />
        <img
          src="/images/foto-pre-lancamento_mobile-min.png"
          alt=""
          class="w-full h-full object-contain object-bottom"
          loading="lazy"
        />
      </picture>
    </div>
    <div
      class="w-full mx-auto max-w-[346px] sm:max-w-[45rem] h-full box-border px-4 pt-10 pb-10 sm:pb-16 flex flex-col z-10 relative"
    >
      <img
        src="/images/logo-light.png"
        width="235"
        height="40"
        class="w-[235px] h-[40px] sm:w-[282px] sm:h-[48px] mx-auto mb-10 sm:mb-8"
        alt=""
      />
      <h1
        class="text-2xl sm:text-[3.5rem] uppercase sm:leading-[4rem] font-bold text-white text-center mb-2"
      >
        Seu passaporte para
        <span class="text-yellow-500">Novas experiências</span>!
      </h1>
      <p class="text-base sm:text-2xl text-gray-100 text-center mb-10">
        Diga adeus à rotina de visitar sempre os mesmos lugares. Vamos te
        surpreender com <strong>locais incríveis</strong> que você nem sabia que
        estavam <strong>ao seu alcance</strong>.
      </p>
      <div
        class="flex flex-col gap-y-2 sm:gap-y-4 justify-center items-center sm:mt-auto"
      >
        <h2
          class="text-white text-center drop-shadow-[1px_2px_3px_#000] text-base font-bold sm:text-2xl"
        >
          Mantenha-se informado,<br />
          siga-nos no Instagram!
        </h2>
        <NuxtLink
          to="https://instagram.com"
          target="_blank"
          class="button primary uppercase"
        >
          <span>@OndeVamos.app</span>
          <NuxtIcon name="instagram" filled />
        </NuxtLink>
      </div>
    </div>
  </main>
</template>

<script lang="ts" setup>
useHead({
  title: 'OndeVamos - Seu passaporte para Novas experiências!',
  meta: [
    {
      name: 'description',
      content:
        'Diga adeus à rotina de visitar sempre os mesmos lugares. Vamos te surpreender com locais incríveis que você nem sabia que estavam ao seu alcance.',
    },
  ],
})
</script>

<style lang="postcss" scoped>
.background {
  @apply absolute inset-0 w-full h-full;
  @apply bg-gray-900;
}

.button {
  @apply inline-flex w-fit text-base items-center px-4 sm:px-6 transition-all ease-in ring-4 border-transparent ring-transparent font-bold rounded-lg min-h-[48px];
  &.primary {
    @apply text-gray-900 bg-yellow-500 hover:bg-yellow-400 hover:ring-yellow-500/20 focus:ring-2 focus:ring-yellow-700;
  }
}
.nuxt-icon {
  @apply text-2xl ml-3;
}
</style>
