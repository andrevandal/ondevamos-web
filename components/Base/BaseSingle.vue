<template>
  <div>
    {{ slug }}
  </div>
</template>

<script lang="ts">
export default defineComponent({
  props: {
    slug: {
      type: [String, Array, null] as PropType<String | String[] | null>,
      default: '',
    },
  },
})
</script>
