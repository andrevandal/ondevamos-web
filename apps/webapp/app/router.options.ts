import type { RouterConfig } from '@nuxt/schema'
// https://router.vuejs.org/api/interfaces/routeroptions.html
export default <RouterConfig>{
  scrollBehavior(to, from, savedPosition) {
    // if (to.name === 'custom' && from.name === 'index') {
    //   return {}
    // }
    if (from.name === 'custom' && to.name === 'index' && savedPosition) {
      return savedPosition
    }
    return {}
  },
}
