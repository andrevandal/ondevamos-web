<template>
  <section
    class="md:flex md:flex-row md:justify-between md:max-w-[710px] xl:max-w-[1136px] md:w-full md:mx-auto"
  >
    <div class="hidden md:flex md:flex-col">
      <span class="text-base leading-5 text-gray-500">Buscando por:</span>
      <span class="text-2xl font-bold leading-7 text-gray-900">{{
        searchTerm
      }}</span>
    </div>
    <div class="relative mx-auto md:mx-0 w-full max-w-[343px]">
      <div class="flex gap-x-2">
        <button
          type="button"
          :class="[
            $style.button,
            'flex-1',
            {
              [$style.active]: isFilterOpen,
            },
          ]"
          href="#"
          @click="toggle('filter')"
        >
          <NuxtIcon name="filter-circle" filled />
          Filtre os resultados
        </button>
        <button
          type="button"
          :class="[
            $style.button,
            $style.info,
            {
              [$style.active]: isInfoOpen,
            },
          ]"
          href="#"
          @click="toggle('info')"
        >
          <NuxtIcon name="info" filled />
        </button>
      </div>
      <div
        v-if="isOpen"
        ref="toggleRef"
        class="absolute z-10 w-full p-4 mt-2 bg-white border border-gray-100 rounded-lg shadow-sm"
      >
        <form v-if="isFilterOpen" class="flex flex-col gap-y-6">
          <fieldset class="flex flex-col gap-y-2">
            <span class="text-base font-medium leading-5 text-gray-900"
              >Classificação</span
            >
            <span class="inline-flex rounded-md isolate">
              <label class="flex-1 cursor-pointer">
                <input class="hidden peer" type="radio" name="ratingLevel" />
                <div
                  class="relative inline-flex items-center px-4 py-[0.625rem] text-base leading-5 text-gray-900 bg-white rounded-l-md ring-1 ring-gray-100 hover:bg-yellow-50 hover:ring-yellow-200 peer-checked:bg-yellow-50 w-full justify-center"
                >
                  Todas
                </div>
              </label>
              <label class="flex-1 cursor-pointer">
                <input class="hidden peer" type="radio" name="ratingLevel" />
                <div
                  class="relative inline-flex items-center px-4 py-[0.625rem] text-base leading-5 text-gray-900 bg-white ring-1 ring-gray-100 hover:bg-yellow-50 hover:ring-yellow-200 peer-checked:bg-yellow-50 w-full justify-center"
                >
                  3,5<NuxtIcon
                    name="rating-star-full"
                    filled
                    class="text-yellow-500"
                  />
                </div>
              </label>
              <label class="flex-1 cursor-pointer">
                <input class="hidden peer" type="radio" name="ratingLevel" />
                <div
                  class="relative inline-flex items-center px-4 py-[0.625rem] text-base leading-5 text-gray-900 bg-white ring-1 ring-gray-100 hover:bg-yellow-50 hover:ring-yellow-200 peer-checked:bg-yellow-50 w-full justify-center"
                >
                  4,0<NuxtIcon
                    name="rating-star-full"
                    filled
                    class="text-yellow-500"
                  />
                </div>
              </label>
              <label class="flex-1 cursor-pointer">
                <input class="hidden peer" type="radio" name="ratingLevel" />
                <div
                  class="relative inline-flex items-center px-4 py-[0.625rem] text-base leading-5 text-gray-900 bg-white ring-1 ring-gray-100 hover:bg-yellow-50 hover:ring-yellow-200 peer-checked:bg-yellow-50 rounded-r-md w-full justify-center"
                >
                  4,5<NuxtIcon
                    name="rating-star-full"
                    filled
                    class="text-yellow-500"
                  />
                </div>
              </label>
            </span>
          </fieldset>
          <div class="flex flex-col gap-y-2">
            <span class="text-base font-medium leading-5 text-gray-900"
              >Nível de Preço</span
            >
            <span class="inline-flex rounded-md isolate">
              <button
                type="button"
                class="relative inline-flex items-center px-4 py-[0.625rem] text-base leading-5 text-gray-900 bg-white rounded-md ring-1 ring-gray-100 hover:bg-yellow-50 hover:ring-yellow-200 gap-x-2 w-full justify-center transition-all ease-in"
              >
                Todos
                <NuxtIcon
                  name="price-level-outlined"
                  filled
                  class="text-xl leading-5 text-green-500"
                />
                <NuxtIcon
                  name="price-level-outlined"
                  filled
                  class="text-xl leading-5 text-green-500"
                />
                <NuxtIcon
                  name="price-level-outlined"
                  filled
                  class="text-xl leading-5 text-green-500"
                />
                <NuxtIcon
                  name="price-level-outlined"
                  filled
                  class="text-xl leading-5 text-green-500"
                />
              </button>
            </span>
          </div>
          <fieldset class="flex flex-col gap-y-2">
            <span class="text-base font-medium leading-5 text-gray-900"
              >Estabelecimentos</span
            >
            <span class="inline-flex gap-2 isolate">
              <label class="cursor-pointer">
                <input class="hidden peer" type="checkbox" name="tags" />
                <div
                  class="relative inline-flex items-center px-4 py-[0.625rem] text-base leading-5 text-gray-900 bg-white rounded-md ring-1 ring-gray-100 hover:bg-yellow-50 hover:ring-yellow-200 gap-x-2 justify-center transition-all ease-in peer-checked:bg-yellow-50 w-full whitespace-nowrap"
                >
                  Pet Friendly
                </div>
              </label>
              <label class="cursor-pointer">
                <input class="hidden peer" type="checkbox" name="tags" />
                <div
                  class="relative inline-flex items-center px-4 py-[0.625rem] text-base leading-5 text-gray-900 bg-white rounded-md ring-1 ring-gray-100 hover:bg-yellow-50 hover:ring-yellow-200 gap-x-2 justify-center transition-all ease-in peer-checked:bg-yellow-50 w-full whitespace-nowrap"
                >
                  Opções Veganas
                </div>
              </label>
            </span>
          </fieldset>
          <fieldset class="flex flex-col gap-y-2">
            <span class="text-base font-medium leading-5 text-gray-900"
              >Horas</span
            >
            <span class="inline-flex rounded-md isolate">
              <label class="flex-1 cursor-pointer">
                <input class="hidden peer" type="radio" name="openingHours" />
                <div
                  class="relative inline-flex items-center px-4 py-[0.625rem] text-base leading-5 text-gray-900 bg-white rounded-l-md ring-1 ring-gray-100 hover:bg-yellow-50 hover:ring-yellow-200 peer-checked:bg-yellow-50 w-full justify-center whitespace-nowrap"
                >
                  Qualquer horário
                </div>
              </label>
              <label class="flex-1 cursor-pointer">
                <input class="hidden peer" type="radio" name="openingHours" />
                <div
                  class="relative inline-flex items-center px-4 py-[0.625rem] text-base leading-5 text-gray-900 bg-white ring-1 ring-gray-100 hover:bg-yellow-50 hover:ring-yellow-200 peer-checked:bg-yellow-50 rounded-r-md w-full justify-center whitespace-nowrap"
                >
                  Aberto agora
                </div>
              </label>
            </span>
          </fieldset>
          <div class="flex flex-col pt-4 border-t gap-y-2 border-t-gray-100">
            <span class="inline-flex rounded-md isolate gap-x-2">
              <button
                type="button"
                class="flex-1 py-2 text-base text-center text-gray-900 transition-all ease-in bg-white rounded-full ring-1 ring-inset ring-gray-100 hover:ring-gray-200 hover:ring-2"
              >
                Limpar
              </button>
              <button
                type="button"
                class="flex-1 py-2 text-base text-center text-gray-900 transition-all ease-in rounded-full bg-yellow-500 hover:bg-yellow-400"
              >
                Aplicar
              </button>
            </span>
          </div>
        </form>
        <div v-if="isInfoOpen" class="flex flex-col gap-y-4">
          <span
            class="w-full pb-4 text-base font-bold leading-5 text-center border-b border-b-gray-200"
            >Como é calculado?</span
          >
          <p>
            O valor é definido considerando o
            <strong>custo médio por pessoa</strong>.
          </p>
          <p>
            Para restaurantes, lanchonetes e afins, o resultado é obtido através
            da soma de uma refeição completa (um item de entrada, prato
            principal, bebida e sobremesa)
          </p>
          <p class="italic">
            Os estabelecimentos que não colaboraram com as informações
            necessárias, não serão exibidos ao utilizar o filtro.
          </p>
          <p>
            <strong>Lembre-se</strong>: É apenas um <u>custo médio</u>, a
            precisão do valor por pessoa pode variar dependendo de diversos
            fatores, como o menu e as porções dos itens.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
const search = reactive(useSearch())

const searchTerm = computed(() => search.term)

interface Debounce {
  timer: ReturnType<typeof setTimeout> | null
  delay: number
}

const toggleRef = ref<HTMLElement | null>(null)

const debounce: Ref<Debounce> = ref({
  timer: null,
  delay: 50,
})

const isOpen = ref('')

const isFilterOpen = computed(() => isOpen.value === 'filter')
const isInfoOpen = computed(() => isOpen.value === 'info')

const toggle = (type = '') => {
  if (debounce.value.timer) {
    clearTimeout(debounce.value.timer)
  }

  debounce.value.timer = setTimeout(() => {
    isOpen.value = isOpen.value === type ? '' : type
  }, debounce.value.delay)
}

onClickOutside(toggleRef, () => {
  if (isOpen.value) {
    toggle()
  }
})
</script>

<style module lang="postcss">
.button {
  @apply inline-flex items-center justify-center gap-3 px-4 py-[0.875rem] transition-all  text-base leading-5 ease-in border border-gray-100 font-bold rounded-lg bg-white text-gray-900 focus:bg-neutral-50 hover:bg-neutral-50;

  &.active {
    @apply bg-gray-50;
  }
}
.info {
  @apply text-xl py-[0.875rem] px-[0.875rem];
}
</style>
