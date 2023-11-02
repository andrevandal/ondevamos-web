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
        @mouseup="close()"
      />
    </transition>
    <transition name="swipe-modal-contents" appear>
      <div
        v-if="modelValue"
        ref="target"
        class="w-full fixed z-[12] max-h-full modal-contents rounded-t-2xl backface-hidden scrollbar-hide drop-shadow scroll-pt-10"
        @touchstart="touchStart"
        @touchmove="touchMove"
        @touchend="touchEnd"
      >
        <div
          class="sticky top-0 z-20 flex items-center justify-center w-full h-10 bg-white cursor-s-resize backdrop-blur rounded-t-2xl"
          @mousedown="mouseDown"
        >
          <div class="w-10 h-1 bg-gray-300 rounded-full" />
        </div>
        <div class="bg-white">
          <slot />
        </div>
      </div>
    </transition>
  </section>
</template>

<script lang="ts" setup>
const props = defineProps({
  contentsHeight: {
    type: String,
    default: '80vh',
  },
  modelValue: {
    type: Boolean,
    default: false,
  },
})

const propsRef = toRefs(props)

const emit = defineEmits<{
  (e: 'close', value: boolean): void
  (e: 'update:modelValue', value: boolean): void
}>()

const target = ref(null)
const isMouseDown = ref<boolean>(false)
const isTouch = ref<boolean>(false)
const modalQuery = ref<any>(null)
const modalHeight = ref<number>(0)
const moveStartPosition = ref<number>(0)
const nowMovePosition = ref<number>(0)

const virtualContentsHeight = ref<string>('80vh')
const contentsBottomPosition = ref<string>('0px')

const init = () => {
  virtualContentsHeight.value =
    modalHeight.value > 0
      ? modalHeight.value + 'px'
      : propsRef.contentsHeight.value
  contentsBottomPosition.value = contentsBottomPosition.value || '0px'
}

const open = () => {
  init()
  document.documentElement.style.overflowY = 'hidden'
}

const close = () => {
  isMouseDown.value = false
  isTouch.value = false
  document.documentElement.style.overflowY = 'auto'
  emit('close', false)
}

onMounted(() => {
  if (propsRef.modelValue.value) {
    open()
  }
})

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

onClickOutside(target, () => close())
</script>

<style>
.modal-contents {
  max-height: v-bind(virtualContentsHeight);
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
