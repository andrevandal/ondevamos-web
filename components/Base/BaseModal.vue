<template>
  <section
    class="fixed scrollbar-hide z-[15]"
    @mousemove="mouseMove"
    @mouseup="mouseUp"
  >
    <transition name="swipe-modal-background" appear>
      <div
        v-if="modelValue"
        class="fixed z-[11] left-0 top-0 right-0 bottom-0 bg-black/70"
        @mouseup="persistent ? null : close()"
        @click="onClickOutside"
      />
    </transition>
    <transition name="swipe-modal-contents" appear>
      <div
        v-if="modelValue"
        ref="target"
        class="w-full bg-white fixed z-[12] max-h-full modal-contents rounded-t-2xl overflow-y-scroll backface-hidden scrollbar-hide drop-shadow"
        @touchstart="touchStart"
        @touchmove="touchMove"
        @touchend="touchEnd"
      >
        <div
          class="sticky top-0 z-20 flex items-center justify-center w-full h-10 cursor-s-resize bg-white/50 backdrop-blur"
          @mousedown="mouseDown"
        >
          <div class="w-10 h-1 bg-gray-300 rounded-full" />
        </div>
        <slot />
      </div>
    </transition>
  </section>
</template>

<script lang="ts">
export default defineComponent({
  name: 'SwipeModal',
  model: {
    prop: 'modelValue',
    event: 'update:modelValue',
  },
  props: {
    // modal
    modelValue: {
      type: Boolean,
      default: false,
    },
    // modal_background
    persistent: {
      type: Boolean,
      default: false,
    },
    // modal_contents
    fullscreen: {
      type: Boolean,
      default: false,
    },
    contentsHeight: {
      type: String,
      default: '30vh',
    },
  },
  emits: ['update:modelValue'],
  setup(props, context: any) {
    // const
    const propsRef = toRefs(props)
    const isMouseDown = ref<boolean>(false)
    const isTouch = ref<boolean>(false)
    const modalQuery = ref<any>(null)
    const modalHeight = ref<number>(0)
    const virtualContentsHeight = ref<string>('30vh')
    const contentsBottomPosition = ref<string>('0px')
    const moveStartPosition = ref<number>(0)
    const nowMovePosition = ref<number>(0)
    // computed
    const modal = computed({
      get: () => propsRef.modelValue.value,
      set: (value: any) => context.emit('update:modelValue', value),
    })
    // watch
    watch(
      () => propsRef.modelValue.value,
      (newModal: boolean) => {
        if (newModal.valueOf()) {
          open()
        }
      },
    )
    // methed
    const init = () => {
      isMouseDown.value = false
      isTouch.value = false
      modalQuery.value = null
      modalHeight.value = 0
      contentsBottomPosition.value = '0px'
      moveStartPosition.value = 0
      nowMovePosition.value = 0
      virtualContentsHeight.value = propsRef.fullscreen.value
        ? '100%'
        : modalHeight.value > 0
        ? modalHeight.value + 'px'
        : propsRef.contentsHeight.value
    }
    const open = () => {
      init()
      document.documentElement.style.overflowY = 'hidden'
    }
    const close = () => {
      isMouseDown.value = false
      isTouch.value = false
      document.documentElement.style.overflowY = 'auto'
      context.emit('update:modelValue', false)
    }
    const mouseDown = (payload: MouseEvent) => {
      modalQuery.value = document.querySelector('.modal-contents')
      modalHeight.value = modalQuery.value.getBoundingClientRect().height
      moveStartPosition.value = payload.pageY
      isMouseDown.value = true
    }
    const mouseMove = (payload: MouseEvent) => {
      if (isMouseDown.value) {
        nowMovePosition.value = payload.pageY
        contentsBottomPosition.value =
          (moveStartPosition.value - nowMovePosition.value <= 0
            ? moveStartPosition.value - nowMovePosition.value
            : 0) + 'px'
      }
    }
    const mouseUp = () => {
      isMouseDown.value = false
      if (
        -1 * (moveStartPosition.value - nowMovePosition.value) >
        modalHeight.value * (1 / 8)
      ) {
        close()
      } else {
        contentsBottomPosition.value = 0 + 'px'
      }
    }
    const touchStart = (payload: TouchEvent) => {
      modalQuery.value = document.querySelector('.modal-contents')
      modalHeight.value = modalQuery.value.getBoundingClientRect().height
      if (modalQuery.value.scrollTop <= 0) {
        moveStartPosition.value = payload.touches[0].pageY
        isTouch.value = true
      }
    }
    const touchMove = (payload: TouchEvent) => {
      if (isTouch.value) {
        nowMovePosition.value = payload.touches[0].pageY
        if (moveStartPosition.value - nowMovePosition.value <= 0) {
          contentsBottomPosition.value =
            moveStartPosition.value - nowMovePosition.value + 'px'
        } else {
          contentsBottomPosition.value = 0 + 'px'
        }
        contentsBottomPosition.value =
          (moveStartPosition.value - nowMovePosition.value <= 0
            ? moveStartPosition.value - nowMovePosition.value
            : 0) + 'px'
      }
    }
    const touchEnd = () => {
      isTouch.value = false
      if (
        -1 * (moveStartPosition.value - nowMovePosition.value) >
        modalHeight.value * (1 / 8)
      ) {
        close()
      } else {
        contentsBottomPosition.value = 0 + 'px'
      }
    }
    // lifeCycle
    onMounted(() => {
      if (propsRef.modelValue.value) {
        open()
      }
    })
    const onClickOutside = (_event: PointerEvent) => {
      close()
    }
    return {
      propsRef,
      modal,
      modalHeight,
      contentsBottomPosition,
      close,
      mouseDown,
      mouseMove,
      mouseUp,
      touchStart,
      touchMove,
      touchEnd,
      onClickOutside,
      virtualContentsHeight,
    }
  },
})
</script>

<style scoped>
.modal-contents {
  min-height: v-bind(virtualContentsHeight);
  bottom: v-bind(contentsBottomPosition);
}
.swipe-modal-background {
  &-enter {
    & {
      @apply opacity-0;
    }
    &-from {
      @apply opacity-0;
    }
    &-active {
      @apply transition-all;
    }
    &-to {
      @apply opacity-100;
    }
  }
  &-leave {
    & {
      @apply opacity-100;
    }
    &-from {
      @apply opacity-100;
    }
    &-active {
      @apply transition-all;
    }
    &-to {
      @apply opacity-0;
    }
  }
}
.swipe-modal-contents {
  &-enter {
    & {
      bottom: calc(-1 * v-bind(virtualContentsHeight)) !important;
    }
    &-from {
      bottom: calc(-1 * v-bind(virtualContentsHeight)) !important;
    }
    &-active {
      transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    }
    &-to {
      bottom: v-bind(contentsBottomPosition) !important;
    }
  }
  &-leave {
    & {
      bottom: v-bind(contentsBottomPosition) !important;
    }
    &-from {
      bottom: v-bind(contentsBottomPosition) !important;
    }
    &-active {
      transition: all 0.25s cubic-bezier(0.25, 0.8, 0.25, 1);
    }
    &-to {
      bottom: calc(-1 * v-bind(virtualContentsHeight)) !important;
    }
  }
}
</style>
