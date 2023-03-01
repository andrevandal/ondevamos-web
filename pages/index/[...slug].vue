<template>
  <BaseModal v-model="isModal" contents-height="50vh" border-top-radius="16px">
    {{ route }}
  </BaseModal>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'

const isModal = ref(true)
const route = useRoute()
const router = useRouter()

watch(isModal, (newValue, _oldValue) => {
  if (!newValue) {
    return router.push({
      path: '/',
    })
  }
})
</script>
