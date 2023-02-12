<template>
  <header class="py-3 bg-gray-800">
    <nav class="container flex flex-row justify-between px-4 sm:px-6">
      <a href="/" class="flex-1">
        <span class="sr-only">ondevamos.app</span>
        <img src="/images/logo.svg" class="w-auto h-10" height="40" />
      </a>
      <a
        href="#"
        class="inline-flex items-center gap-3 px-4 py-2 text-gray-800 bg-orange-500 rounded-lg"
      >
        <NuxtIcon name="log-in" />
        <span>Entrar</span>
      </a>
    </nav>
    <section class="container p-4">
      <BaseAd />
      <div class="flex flex-col gap-2 py-6 text-center">
        <h1 class="text-2xl leading-7 tracking-tighter text-white">
          Explore os melhores lugares e encontre a experiência perfeita para
          você!
        </h1>
        <h2 class="text-gray-300">
          Planeje o seu próximo rolê na companhia que você gosta!
        </h2>
      </div>
      <BaseSearch />
    </section>
  </header>
</template>

<style></style>
