// https://nuxt.com/docs/api/configuration/nuxt-config
import { resolve } from 'pathe'

const { API_BASE_URL, GA_MEASUREMENT_ID, GA_HOST, STRAPI_URL } = process.env

export default defineNuxtConfig({
  experimental: { payloadExtraction: false },
  css: ['~/assets/css/main.css'],
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
      strapi: {
        url: STRAPI_URL,
      },
    },
  },
  modules: ['nuxt-icons', '@vueuse/nuxt', '@nuxtjs/strapi'],
  // plugins: [{ src: '~/plugins/vue-swipe-modal.ts', mode: 'client' }],
  hooks: {
    'pages:extend'(routes) {
      routes.push({
        name: 'custom',
        path: '/:slug/',
        file: resolve(__dirname, 'pages/index.vue'),
      })
    },
  },
})
