<template>
  <ul ref="list" class="flex flex-row gap-2 overflow-hidden snap-x snap-mandatory" :class="[{
    'snap-none': isMouseActive || isDown
  }]">
    <li v-for="(resource, resourceKey) in resources" :key="`resource-${resourceKey}`">
      <a href="#"
        class="inline-flex items-center gap-3 px-4 py-2 text-white border-t border-white rounded-lg border-opacity-5 bg-opacity-5 whitespace-nowrap bg-gradient-to-r from-white/5 to-white/5 hover:from-[#FBAD3F]/10 hover:to-[#FF8157]/10 transition-all duration-500 ease-in-out">
        <NuxtIcon :name="resource.icon" />
        <span>{{ resource.label }}</span>
      </a>
    </li>
  </ul>
</template>

<script lang="ts" setup>
import { useEventListener } from '@vueuse/core'
import { ref } from 'vue'

interface Resource {
  slug: string,
  label: string,
  icon: string
}

interface Props {
  resources: Resource[]
}

const props = defineProps<Props>()
const resources = props.resources

const isMouseActive = ref(false)
const isDown = ref(false)

let startX = ref(0);
let scrollLeft = ref(0);


const list = ref<HTMLElement>()

useEventListener(list, 'mousedown', (e:MouseEvent) => {
  if (!list.value) return;
  isDown.value = true;
  startX.value = e.pageX - list.value.offsetLeft;
  scrollLeft.value = list.value.scrollLeft;
})

useEventListener(list, 'mouseleave', (e: MouseEvent) => {
  isDown.value = false
})

useEventListener(list, 'mouseup', (e: MouseEvent) => {
  isDown.value = false
})

useEventListener(list, 'mousemove', (e:MouseEvent) => {
  e.preventDefault();
  if (!isDown.value || !list.value) return;
  const offsetLeft = list.value.offsetLeft || 0
  
  const x = e.pageX - offsetLeft;
  const SCROLL_SPEED = 1.5;
  const walk = (x - startX.value) * SCROLL_SPEED;
  list.value.scrollLeft = scrollLeft.value - walk;
})

</script>