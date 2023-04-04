<template>
  <header class="pt-3 pb-6 bg-gray-900">
    <nav
      class="container flex flex-row justify-between max-w-sm gap-2 px-4 mx-auto"
    >
      <a href="/" class="flex-1">
        <span class="sr-only">ondevamos.app</span>
        <img src="/images/logo-light.svg" class="w-auto h-10" height="40" />
      </a>
      <BaseButton icon="log-in" href="#">
        <span>Entrar</span>
      </BaseButton>
    </nav>
    <section>
      <div class="container max-w-sm p-4 mx-auto">
        <BaseAd />
        <div class="flex flex-col gap-2 py-6 text-center">
          <h1
            class="text-2xl font-extrabold leading-7 tracking-tighter text-white"
          >
            Explore os melhores lugares e encontre a experiência perfeita para
            você!
          </h1>
          <h2 class="text-gray-300">
            Planeje o seu próximo rolê na companhia que você gosta!
          </h2>
        </div>
      </div>
      <BaseSearch />
    </section>
  </header>
</template>

<style></style>
