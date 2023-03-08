<template>
  <ul
    ref="list"
    :class="[
      'flex flex-row flex-nowrap gap-2 scrollbar-hide overflow-x-scroll cursor-grab',
      {
        'snap-none': isDown,
        'cursor-grabbing': isDown,
      },
    ]"
  >
    <li
      v-for="(resource, resourceKey) in resourcesList"
      :key="`resource-${resourceKey}`"
      class="snap-center first-of-type:ml-4 last-of-type:mr-4"
    >
      <a
        href="#"
        :class="[
          'inline-flex items-center gap-3 px-4 py-3 text-white border-t border-white rounded-lg border-opacity-5 bg-opacity-5 whitespace-nowrap bg-gradient-to-r from-white/5 to-white/5 hover:from-[#FBAD3F]/10 hover:to-[#FF8157]/10 transition-all duration-500 ease-in-out leading-5',
          {
            'cursor-grabbing': isDown,
          },
        ]"
      >
        <NuxtIcon
          :name="resource.icon"
          class="text-2xl leading-6 -mb-[.125em]"
        />
        <span class="text-base">{{ resource.label }}</span>
      </a>
    </li>
  </ul>
</template>

<script lang="ts">
import { useEventListener } from '@vueuse/core'
import { ref, PropType } from 'vue'

type Resource = {
  slug: string
  label: string
  icon: string
}

export default defineComponent({
  props: {
    resources: {
      type: Array as PropType<Resource[]>,
      required: true,
    },
  },
  setup(props) {
    // const isMouseActive = ref(false)
    const isDown = ref(false)

    const startX = ref(0)
    const scrollLeft = ref(0)

    const list = ref<HTMLElement | null>(null)
    const velX = ref(0)
    const momentumID = ref<number | null>(null)

    useEventListener(list, 'mousedown', (e: MouseEvent) => {
      if (!list.value) return
      isDown.value = true
      startX.value = e.pageX - list.value.offsetLeft
      scrollLeft.value = list.value.scrollLeft
      cancelMomentumTracking()
    })

    useEventListener(list, 'mouseleave', (_e: MouseEvent) => {
      isDown.value = false
    })

    useEventListener(list, 'mouseup', (_e: MouseEvent) => {
      isDown.value = false
      beginMomentumTracking()
    })

    useEventListener(list, 'mousemove', (e: MouseEvent) => {
      if (!isDown.value || !list.value) return
      e.preventDefault()

      const x = e.pageX - list.value.offsetLeft
      const walk = x - startX.value // scroll-fast
      const prevScrollLeft = list.value.scrollLeft
      list.value.scrollLeft = scrollLeft.value - walk
      velX.value = list.value.scrollLeft - prevScrollLeft
    })

    useEventListener(list, 'wheel', () => {
      cancelMomentumTracking()
    })

    function beginMomentumTracking() {
      cancelMomentumTracking()
      momentumID.value = requestAnimationFrame(momentumLoop)
    }

    function cancelMomentumTracking() {
      if (!momentumID.value) {
        return
      }
      cancelAnimationFrame(momentumID.value)
    }

    function momentumLoop() {
      if (!list.value) {
        return
      }
      list.value.scrollLeft += velX.value * 2
      velX.value *= 0.95
      if (Math.abs(velX.value) > 0.5) {
        momentumID.value = requestAnimationFrame(momentumLoop)
      }
    }

    useEventListener(list, 'wheel', (e: WheelEvent) => {
      e.preventDefault()

      window.requestAnimationFrame(() => {
        if (!list.value) {
          return
        }
        list.value.scrollTo({
          top: 0,
          left: list.value.scrollLeft + e.deltaY * 2,
          behavior: 'smooth',
        })
      })
    })

    return {
      isDown,
      resourcesList: props.resources,
      list,
    }
  },
})
</script>
