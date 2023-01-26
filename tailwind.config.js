/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('tailwindcss').Config} */
const tailwindTypography = require('@tailwindcss/typography')
const plugin = require('tailwindcss/plugin')

module.exports = {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}',
    './app.vue',
  ],
  theme: {
    extend: {},
  },
  plugins: [
    tailwindTypography,
    plugin(function ({ addBase, _theme }) {
      addBase({
        // 'body.font-poppins': {
        //   fontFamily: ['Poppins', theme('fontFamily.sans')].join(', '),
        // },
        'body.no-scroll': {
          overflow: 'hidden',
        },
        html: {
          scrollBehavior: 'smooth',
        },
      })
    }),
  ],
}
