/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('tailwindcss').Config} */
const tailwindTypography = require('@tailwindcss/typography')
const plugin = require('tailwindcss/plugin')
const defaultTheme = require('tailwindcss/defaultTheme')

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
    extend: {
      colors: {
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
          DEFAULT: '#9ca3af',
        },
        orange: {
          50: '#FCF2E8',
          100: '#FBE6D0',
          200: '#FBD7B1',
          300: '#FCCB97',
          400: '#FFBE7A',
          500: '#FFAD57',
          600: '#FA9B38',
          700: '#ED8A21',
          800: '#D97812',
          900: '#B36514',
          DEFAULT: '#FFAD57',
        },
        green: {
          50: '#E6F2F0',
          100: '#B6D9D4',
          200: '#86C0B7',
          300: '#56A69A',
          400: '#258D7D',
          500: '#0D806E',
          600: '#0C7363',
          700: '#095A4D',
          800: '#074037',
          900: '#042621',
          DEFAULT: '#258D7D',
        },
        red: {
          50: '#F6DAD6',
          100: '#F2C7C1',
          200: '#EAA298',
          300: '#E17C6F',
          400: '#D85746',
          500: '#D44431',
          600: '#AA3627',
          700: '#7F291D',
          800: '#551B14',
          900: '#2A0E0A',
          DEFAULT: '#D85746',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Inter Fallback', ...defaultTheme.fontFamily.sans],
      },
      ringWidth: {
        3: '3px',
      },
    },
  },
  plugins: [
    tailwindTypography,
    plugin(function ({ addBase, _theme }) {
      addBase({
        'body.no-scroll': {
          overflow: 'hidden',
        },
        html: {
          scrollBehavior: 'smooth',
          overflowX: 'hidden',
        },
      })
    }),
    plugin(function ({ addUtilities }) {
      addUtilities(
        {
          '.scrollbar-hide': {
            /* IE and Edge */
            '-ms-overflow-style': 'none',

            /* Firefox */
            'scrollbar-width': 'none',

            /* Safari and Chrome */
            '&::-webkit-scrollbar': {
              display: 'none',
            },
          },

          '.scrollbar-default': {
            /* IE and Edge */
            '-ms-overflow-style': 'auto',

            /* Firefox */
            'scrollbar-width': 'auto',

            /* Safari and Chrome */
            '&::-webkit-scrollbar': {
              display: 'block',
            },
          },
        },
        ['responsive'],
      )
    }),
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.backface-visible': {
          'backface-visibility': 'visible',
          '-moz-backface-visibility': 'visible',
          '-webkit-backface-visibility': 'visible',
          '-ms-backface-visibility': 'visible',
        },
        '.backface-hidden': {
          'backface-visibility': 'hidden',
          '-moz-backface-visibility': 'hidden',
          '-webkit-backface-visibility': 'hidden',
          '-ms-backface-visibility': 'hidden',
        },
      })
    }),
  ],
}
