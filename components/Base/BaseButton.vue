<script lang="ts">
import { h, defineComponent} from 'vue'

import { NuxtIcon, NuxtLink } from '#components'

export default defineComponent({
  props: {
    href: {
      type: String,
      required: false
    },
    icon: {
      type: String,
      required: false
    },
  },
  setup(props, { slots }) {
    const classList = ['inline-flex items-center gap-3 px-4 py-2 text-gray-800 transition-all ease-in bg-orange-500 rounded-lg ring ring-transparent hover:ring-orange/50']

    const tag = props.href ? NuxtLink : 'button'

    return () => h(tag, {
      href: props.href,
      class: classList
    },
    [
      ...[ props.icon && h(NuxtIcon, {
        name: props.icon
      }) ],
      slots.default!()
    ])
  }
})
</script>