<template>
  <BaseHorizontalScroll
    ref="scrollInstance"
    class="flex flex-row gap-2 overflow-x-scroll flex-nowrap scrollbar-hide cursor-grab lg:max-w-fit lg:mx-auto"
  >
    <template #default="{ isMouseDown }">
      <li
        v-for="resource in shownResourcesList"
        :key="`resource-${resource.slug}`"
        class="snap-center first-of-type:ml-4 last-of-type:mr-4"
      >
        <NuxtLink
          :to="`/categoria/${resource.slug}/`"
          :class="[
            'inline-flex items-center gap-3 px-4 py-3 text-white border-t border-white rounded-lg border-opacity-5 bg-opacity-5 whitespace-nowrap bg-gradient-to-r from-white/5 to-white/5 hover:from-[#FBAD3F]/10 hover:to-[#FF8157]/10 transition-all duration-500 ease-in-out leading-5',
            {
              'cursor-grabbing': isMouseDown.value,
            },
          ]"
        >
          <span class="text-2xl leading-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 100 100"
              class="w-4 h-4"
            >
              <text y=".9em" font-size="90">{{ resource.icon }}</text>
            </svg>
          </span>
          <span class="text-base">{{ resource.label }}</span>
        </NuxtLink>
      </li>
      <li
        v-if="resourcesList.length > resourcesLimit"
        ref="dropdownRef"
        class="relative snap-center first-of-type:ml-4 last-of-type:mr-4"
      >
        <button
          class="inline-flex items-center gap-3 px-4 py-3 text-white border-t border-white rounded-lg border-opacity-5 bg-opacity-5 whitespace-nowrap bg-gradient-to-r from-white/5 to-white/5 hover:from-[#FBAD3F]/10 hover:to-[#FF8157]/10 transition-all duration-500 ease-in-out leading-5"
          @click="toggleDropdown"
        >
          <NuxtIcon
            name="more-horizontal"
            class="text-2xl leading-6 -mb-[.125em]"
          />
          <span class="text-base">Mais</span>
        </button>
        <div
          v-show="isDropdownVisible"
          ref="dropdownMenuRef"
          :style="dropdownStyles"
          class="fixed z-10 px-1 py-2 mt-2 translate-x-0 bg-white rounded-lg shadow-xl"
        >
          <ul class="flex flex-col gap-y-2">
            <li
              v-for="resource in hiddenResourcesList"
              :key="`dropdown-resource-${resource.slug}`"
            >
              <NuxtLink
                :to="`/categoria/${resource.slug}/`"
                class="inline-flex items-center w-full py-2 pl-4 pr-5 leading-5 text-gray-900 transition-all duration-500 ease-in-out rounded gap-x-2 whitespace-nowrap hover:bg-yellow-50"
              >
                <span class="text-base leading-5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 100 100"
                    class="w-4 h-4"
                  >
                    <text y=".9em" font-size="90">{{ resource.icon }}</text>
                  </svg>
                </span>
                <span class="flex-1 text-base">{{ resource.label }}</span>
              </NuxtLink>
            </li>
          </ul>
        </div>
      </li>
    </template>
  </BaseHorizontalScroll>
</template>

<script lang="ts">
import { useEventListener } from '@vueuse/core'
import { defineComponent, onMounted, ref } from 'vue'
import { BaseHorizontalScroll } from '#components'

type Resource = {
  slug: string
  label: string
  icon: string
}

interface Debounce {
  timer: ReturnType<typeof setTimeout> | null
  delay: number
}

const RESOURCES_LIMIT = 5

export default defineComponent({
  components: {
    BaseHorizontalScroll,
  },
  props: {
    resources: {
      type: Array as () => Resource[],
      required: true,
    },
  },
  setup(props) {
    const dropdownRef = ref<HTMLElement | null>(null)
    const dropdownMenuRef = ref<HTMLElement | null>(null)
    const isDropdownVisible = ref(false)
    const hiddenResourcesList = ref(props.resources.slice(RESOURCES_LIMIT))
    const scrollInstance = ref<typeof BaseHorizontalScroll | null>(null)

    const debounce: Ref<Debounce> = ref({
      timer: null,
      delay: 50,
    })

    const toggleDropdown = () => {
      if (debounce.value.timer) {
        clearTimeout(debounce.value.timer)
      }

      debounce.value.timer = setTimeout(() => {
        isDropdownVisible.value = !isDropdownVisible.value

        if (isDropdownVisible.value) {
          dropdownStyles.value = calculateDropdownStyles()
          if (scrollInstance.value) {
            scrollInstance.value.scrollToRight()
          }
        }
      }, debounce.value.delay)
    }

    const calculateDropdownStyles = () => {
      const dropdownTrigger = dropdownRef.value
      const dropdownElement = dropdownMenuRef.value

      if (!dropdownTrigger || !dropdownElement) {
        return {}
      }

      const dropdownTriggerRect = dropdownTrigger.getBoundingClientRect()
      const dropdownWidth = 222
      const windowWidth = window.innerWidth
      const topPosition = Math.round(
        dropdownTriggerRect.y + dropdownTriggerRect.height,
      )

      let leftPosition = Math.round(dropdownTriggerRect.right - dropdownWidth)

      // Garantir que a dropdown fique visível na janela
      if (leftPosition + dropdownWidth > windowWidth) {
        leftPosition = windowWidth - dropdownWidth - 8
      }

      return {
        left: `${leftPosition}px`,
        top: `${topPosition}px`,
      }
    }

    onMounted(() => {
      useEventListener(window, 'scroll', () => {
        if (isDropdownVisible.value) {
          dropdownStyles.value = calculateDropdownStyles()
        }
      })
    })

    const shownResourcesList = ref(props.resources.slice(0, RESOURCES_LIMIT))

    const dropdownStyles = ref()

    onClickOutside(dropdownMenuRef, () => {
      if (isDropdownVisible.value) {
        toggleDropdown()
      }
    })

    return {
      shownResourcesList,
      resourcesList: props.resources,
      toggleDropdown,
      isDropdownVisible,
      hiddenResourcesList,
      resourcesLimit: RESOURCES_LIMIT,
      dropdownStyles,
      dropdownRef,
      dropdownMenuRef,
      scrollInstance,
    }
  },
})
</script>
