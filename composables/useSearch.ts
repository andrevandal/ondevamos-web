export default function () {
  const router = useRouter()
  const route = useRoute()

  const term = ref(route.query?.q ?? '')

  watch(
    () => route.query,
    () => (term.value = route.query?.q ?? ''),
  )

  const update = (string: string) => {
    term.value = string

    const query = term.value ? { q: term.value } : {}
    router.push({
      path: '/',
      query,
    })
  }

  return {
    term,
    update,
  }
}
