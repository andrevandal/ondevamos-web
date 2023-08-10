// https://nuxt.com/docs/api/configuration/nuxt-config
import { resolve } from 'pathe'
import { defineNuxtConfig } from 'nuxt/config'

const {
  API_BASE_URL,
  GA_MEASUREMENT_ID,
  GA_HOST,
  DATABASE_URL,
  SESSION_SECRET,
  ADMIN_TOKEN,
} = process.env

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
    databaseUrl: DATABASE_URL,
    sessionSecret: SESSION_SECRET,
    adminToken: ADMIN_TOKEN,
    public: {
      apiBaseUrl: API_BASE_URL,
      gaMeasurementID: GA_MEASUREMENT_ID,
      gaHost: GA_HOST,
    },
  },

  modules: ['nuxt-icons', '@vueuse/nuxt', '@nuxtjs/tailwindcss'],

  hooks: {
    'pages:extend'(routes) {
      routes.push({
        name: 'custom',
        path: '/:slug/',
        file: resolve(__dirname, 'pages/index.vue'),
      })
    },
  },

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
