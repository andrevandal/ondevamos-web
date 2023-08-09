// https://nuxt.com/docs/api/configuration/nuxt-config
const { API_BASE_URL, GA_MEASUREMENT_ID, GA_HOST } = process.env

export default defineNuxtConfig({
  postcss: {
    plugins: {
      'postcss-import': {},
      'tailwindcss/nesting': 'postcss-nested',
      tailwindcss: {},
      autoprefixer: {},
      'postcss-preset-env': {
        features: { 'nesting-rules': false },
      },
    },
  },
  app: {
    head: {
      viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
      charset: 'utf-8',
    },
  },
  runtimeConfig: {
    public: {
      apiBaseUrl: API_BASE_URL,
      gaMeasurementID: GA_MEASUREMENT_ID,
      gaHost: GA_HOST,
    },
  },
  modules: ['nuxt-icons', '@vueuse/nuxt', '@nuxtjs/tailwindcss'],
  nitro: {
    preset: 'cloudflare_pages',
  },
  devtools: {
    enabled: true,
  },
  tailwindcss: {
    cssPath: '~/assets/css/main.css',
  },
})
