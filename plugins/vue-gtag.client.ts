import VueGtag, { trackRouter } from 'vue-gtag-next'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const eventTime = () => Math.round(new Date().getTime() / 1000)

  nuxtApp.vueApp.use(VueGtag, {
    property: [
      {
        id: config.public.gaMeasurementID,
        params: {
          anonymize_ip: true,
          send_page_view: true,
          cookie_domain: 'auto',
          event_time: eventTime(),
        },
      },
    ],
  })
  trackRouter(useRouter())
})
