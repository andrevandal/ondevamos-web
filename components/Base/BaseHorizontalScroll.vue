<template>
  <component :is="tag" ref="listRef" :class="rootClasses" v-bind="$attrs">
    <slot :is-mouse-down="isMouseDown" />
  </component>
</template>

<script lang="ts">
import { useEventListener } from '@vueuse/core'
import { defineComponent, ref, onMounted, computed } from 'vue'

const MIN_VELOCITY = 0.5
const WHEEL_SCROLL_MULTIPLIER = 2

export default defineComponent({
  props: {
    tag: {
      type: String,
      default: 'ul',
    },
  },
  setup(_props, { attrs }) {
    const isMouseDown = ref(false)
    const startX = ref(0)
    const scrollLeft = ref(0)
    const listRef = ref<HTMLElement | null>(null)
    const velX = ref(0)
    const momentumTrackingID = ref<number | null>(null)

    const rootClasses = computed(() => [
      attrs.classes,
      {
        'snap-none': isMouseDown.value,
        'cursor-grabbing': isMouseDown.value,
      },
    ])

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
    })

    const scrollToRight = () => {
      if (listRef.value) {
        listRef.value.scrollLeft =
          listRef.value.scrollWidth - listRef.value.clientWidth
      }
    }

    return {
      isMouseDown,
      rootClasses,
      listRef,
      scrollToRight,
    }
  },
})
</script>
