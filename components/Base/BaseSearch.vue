<template>
  <div class="flex flex-col gap-y-6">
    <form
      class="flex items-center justify-between bg-white rounded-lg ring-4 ring-orange-500 ring-opacity-75"
    >
      <input
        type="search"
        class="flex-1 px-6 py-3 bg-transparent outline-none"
        placeholder="Onde vamos hoje? 🤭"
      />
      <button type="submit" class="px-6 py-3 bg-transparent">🔍</button>
    </form>
    <ul class="flex flex-row gap-2 overflow-hidden">
      <li>
        <a
          href="#"
          class="inline-flex items-center gap-3 px-4 py-2 text-white bg-white border-t border-white rounded-lg border-opacity-5 bg-opacity-5"
        >
          <NuxtIcon name="log-in" />
          <span>Hamburgueria</span>
        </a>
      </li>
      <li>
        <a
          href="#"
          class="inline-flex items-center gap-3 px-4 py-2 text-white bg-white border-t border-white rounded-lg border-opacity-5 bg-opacity-5"
        >
          <NuxtIcon name="log-in" />
          <span>Hamburgueria</span>
        </a>
      </li>
    </ul>
  </div>
</template>
