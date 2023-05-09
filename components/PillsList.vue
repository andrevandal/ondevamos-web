<template>
  <ul ref="listRef" :class="listClasses">
    <li
      v-for="resource in shownResourcesList"
      :key="`resource-${resource.slug}`"
      class="snap-center first-of-type:ml-4 last-of-type:mr-4"
    >
      <NuxtLink :to="`/categoria/${resource.slug}/`" :class="itemClasses">
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
      <!-- Add a method to update the resource.url -->
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
  </ul>
</template>

<script lang="ts">
import { useEventListener } from '@vueuse/core'
import { defineComponent, onMounted, ref } from 'vue'

type Resource = {
  slug: string
  label: string
  icon: string
}

const MIN_VELOCITY = 0.5
const WHEEL_SCROLL_MULTIPLIER = 2
const RESOURCES_LIMIT = 5

export default defineComponent({
  props: {
    resources: {
      type: Array as () => Resource[],
      required: true,
    },
  },
  setup(props) {
    const isMouseDown = ref(false)
    const startX = ref(0)
    const scrollLeft = ref(0)
    const listRef = ref<HTMLElement | null>(null)
    const dropdownRef = ref<HTMLElement | null>(null)
    const dropdownMenuRef = ref<HTMLElement | null>(null)
    const velX = ref(0)
    const momentumTrackingID = ref<number | null>(null)
    const isDropdownVisible = ref(false)
    const hiddenResourcesList = ref(props.resources.slice(RESOURCES_LIMIT))

    const toggleDropdown = () => {
      isDropdownVisible.value = !isDropdownVisible.value
      if (isDropdownVisible.value) {
        dropdownStyles.value = calculateDropdownStyles()

        if (listRef.value) {
          listRef.value.scrollLeft =
            listRef.value.scrollWidth - listRef.value.clientWidth
        }
      }
    }

    const calculateDropdownStyles = () => {
      const dropdownTrigger = dropdownRef.value
      const dropdownElement = dropdownMenuRef.value

      if (!dropdownTrigger || !dropdownElement) {
        return {}
      }

      const dropdownTriggerRect = dropdownTrigger.getBoundingClientRect()
      const dropdownWidth = 190
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

    useEventListener(listRef, 'mousedown', (e: MouseEvent) => {
      if (!listRef.value) return
      isMouseDown.value = true
      startX.value = e.pageX - listRef.value.offsetLeft
      scrollLeft.value = listRef.value.scrollLeft
      cancelMomentumTracking()
    })

    useEventListener(listRef, 'mouseleave', (_e: MouseEvent) => {
      isMouseDown.value = false
    })

    useEventListener(listRef, 'mouseup', (_e: MouseEvent) => {
      isMouseDown.value = false
      startMomentumTracking()
    })

    const handleMouseMove = (e: MouseEvent) => {
      if (isMouseDown.value && listRef.value) {
        e.preventDefault()
        const x = e.pageX - listRef.value.offsetLeft
        const walk = x - startX.value
        const prevScrollLeft = listRef.value.scrollLeft
        listRef.value.scrollLeft = scrollLeft.value - walk
        velX.value = listRef.value.scrollLeft - prevScrollLeft
      }
    }

    useEventListener(listRef, 'mousemove', handleMouseMove)

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      window.requestAnimationFrame(() => {
        if (!listRef.value) {
          return
        }
        listRef.value.scrollTo({
          top: 0,
          left: listRef.value.scrollLeft + e.deltaY * WHEEL_SCROLL_MULTIPLIER,
          behavior: 'smooth',
        })
      })
      cancelMomentumTracking()
    }

    useEventListener(listRef, 'wheel', handleWheel)

    const startMomentumTracking = () => {
      cancelMomentumTracking()
      momentumTrackingID.value = requestAnimationFrame(trackMomentum)
    }

    const cancelMomentumTracking = () => {
      if (!momentumTrackingID.value) {
        return
      }
      cancelAnimationFrame(momentumTrackingID.value)
    }

    const trackMomentum = () => {
      if (!listRef.value) {
        return
      }
      listRef.value.scrollLeft += velX.value * 2
      velX.value *= 0.95
      if (Math.abs(velX.value) > MIN_VELOCITY) {
        momentumTrackingID.value = requestAnimationFrame(trackMomentum)
      }
    }

    onMounted(() => {
      const list = listRef.value
      if (list) {
        list.style.scrollBehavior = 'unset'
      }

      useEventListener(window, 'scroll', () => {
        if (isDropdownVisible.value) {
          dropdownStyles.value = calculateDropdownStyles()
        }
      })
    })

    onBeforeUnmount(() => {
      useEventListener(listRef, 'mousemove', handleMouseMove, {
        passive: true,
        capture: false,
      })
      useEventListener(listRef, 'wheel', handleWheel, {
        passive: true,
        capture: false,
      })
    })

    const shownResourcesList = ref(props.resources.slice(0, RESOURCES_LIMIT))

    const dropdownStyles = ref()

    onClickOutside(dropdownMenuRef, () => {
      if (isDropdownVisible.value) {
        toggleDropdown()
      }
    })

    const listClasses = computed(() => [
      'flex flex-row flex-nowrap gap-2 scrollbar-hide overflow-x-scroll cursor-grab lg:max-w-fit lg:mx-auto',
      {
        'snap-none': isMouseDown.value,
        'cursor-grabbing': isMouseDown.value,
      },
    ])

    const itemClasses = computed(() => [
      'inline-flex items-center gap-3 px-4 py-3 text-white border-t border-white rounded-lg border-opacity-5 bg-opacity-5 whitespace-nowrap bg-gradient-to-r from-white/5 to-white/5 hover:from-[#FBAD3F]/10 hover:to-[#FF8157]/10 transition-all duration-500 ease-in-out leading-5',
      {
        'cursor-grabbing': isMouseDown.value,
      },
    ])

    return {
      isMouseDown,
      shownResourcesList,
      resourcesList: props.resources,
      listRef,
      toggleDropdown,
      isDropdownVisible,
      hiddenResourcesList,
      resourcesLimit: RESOURCES_LIMIT,
      dropdownStyles,
      dropdownRef,
      dropdownMenuRef,
      listClasses,
      itemClasses,
    }
  },
})
</script>
