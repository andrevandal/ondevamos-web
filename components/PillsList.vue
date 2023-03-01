<template>
  <ul
    ref="list"
    class="flex flex-row w-full gap-2 overflow-scroll snap-x snap-proximity scrollbar-hide"
    :class="[
      {
        'snap-none': isMouseActive || isDown,
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
        class="inline-flex items-center gap-3 px-4 py-3 text-white border-t border-white rounded-lg border-opacity-5 bg-opacity-5 whitespace-nowrap bg-gradient-to-r from-white/5 to-white/5 hover:from-[#FBAD3F]/10 hover:to-[#FF8157]/10 transition-all duration-500 ease-in-out leading-5"
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
    const isMouseActive = ref(false)
    const isDown = ref(false)

    const startX = ref(0)
    const scrollLeft = ref(0)

    const list = ref<HTMLElement>()

    useEventListener(list, 'mousedown', (e: MouseEvent) => {
      if (!list.value) return
      isDown.value = true
      startX.value = e.pageX - list.value.offsetLeft
      scrollLeft.value = list.value.scrollLeft
    })

    useEventListener(list, 'mouseleave', (_e: MouseEvent) => {
      isDown.value = false
    })

    useEventListener(list, 'mouseup', (_e: MouseEvent) => {
      isDown.value = false
    })

    useEventListener(list, 'mousemove', (e: MouseEvent) => {
      e.preventDefault()
      if (!isDown.value || !list.value) return
      const offsetLeft = list.value.offsetLeft || 0

      const x = e.pageX - offsetLeft
      const SCROLL_SPEED = 1.5
      const walk = (x - startX.value) * SCROLL_SPEED
      list.value.scrollLeft = scrollLeft.value - walk
    })

    return {
      isDown,
      isMouseActive,
      resourcesList: props.resources,
      list,
    }
  },
})
</script>
