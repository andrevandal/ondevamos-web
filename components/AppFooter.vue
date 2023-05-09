<template>
  <footer class="px-4 pt-8 pb-6 text-center text-white bg-gray-900">
    <div
      class="container flex flex-col items-center gap-4 mx-auto lg:flex-row lg:justify-between"
    >
      <div
        class="flex flex-col items-center lg:text-left gap-y-2 lg:items-start"
      >
        <a href="/" class="block">
          <span class="sr-only">ondevamos.app</span>
          <img src="/images/logo-light.svg" class="w-auto h-10" height="40" />
        </a>
        <p>2023 © OndeVamos. Todos os direitos reservados.</p>
        <p>CNPJ: 23.018.045/0001-99</p>
      </div>
      <nav class="flex flex-row gap-2 py-2">
        <a
          v-for="(socialNetwork, socialNetworkIndex) in socialNetworks"
          :key="`social-network-${socialNetworkIndex}`"
          :href="socialNetwork.url"
          class="text-white p-[.8rem] bg-white bg-opacity-5 rounded-full border-t-white border-opacity-5 text-xl leading-5 transition-all ease-in-out hover:bg-opacity-10"
        >
          <span class="sr-only">{{ socialNetwork.label }}</span>
          <NuxtIcon :name="socialNetwork.type" />
        </a>
      </nav>
    </div>
    <div class="pt-6 mt-6 border-t border-t-gray-600">
      <div class="container flex flex-col items-center max-w-sm mx-auto">
        <p class="text-center">
          Feito com 💚️ por<br />
          <a
            href="https://andrevandal.dev"
            class="underline transition-all underline-offset-2 decoration-yellow-500 hover:decoration-transparent hover:text-yellow-500"
            target="_blank"
            >André Vandal</a
          >
          &
          <a
            href="https://instagram.com/pedrohenri.dsgn"
            class="underline transition-all underline-offset-2 decoration-yellow-500 hover:decoration-transparent hover:text-yellow-500"
            target="_blank"
            >Pedro Henri</a
          >
        </p>
      </div>
    </div>
  </footer>
</template>

<script lang="ts" setup>
const socialNetworks = [
  {
    type: 'instagram',
    label: '@ondevamos.app',
    url: 'https://instagram.com/ondevamos.app',
  },
  {
    type: 'facebook',
    label: '@ondevamosapp',
    url: 'https://facebook.com/ondevamosapp',
  },
]
</script>
