/** @type {import('tailwindcss').Config} */
import type { Config } from 'tailwindcss'

import tailwindTypography from '@tailwindcss/typography'
import plugin from 'tailwindcss/plugin'
import defaultTheme from 'tailwindcss/defaultTheme'

// Default are on https://tailwindcss.nuxtjs.org/tailwind/config#default-configuration
export default <Partial<Config>>{
  darkMode: 'class',
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
  ],
  theme: {
    extend: {
      colors: {
        gray: {
          50: '#EFF0F1',
          100: '#DFE0E3',
          200: '#BFC1C7',
          300: '#9EA3AB',
          400: '#7E848F',
          500: '#5E6573',
          600: '#404652',
          700: '#303640',
          800: '#1D2026',
          900: '#12141A',
          DEFAULT: '#5E6573',
        },
        yellow: {
          50: '#FFF6E6',
          100: '#FFEDCC',
          200: '#FFE0A3',
          300: '#FFCE73',
          400: '#FFC14D',
          500: '#F2AB27',
          600: '#D9961A',
          700: '#BA8013',
          800: '#996608',
          900: '#664200',
          DEFAULT: '#F2AB27',
        },
        blue: {
          50: '#99C9FF',
          100: '#69AFFF',
          200: '#459CFF',
          300: '#2689FB',
          400: '#096EE3',
          500: '#055FC8',
          600: '#034FA8',
          700: '#00418C',
          800: '#003573',
          900: '#002959',
          DEFAULT: '#055FC8',
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
    plugin(function ({ addBase }) {
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
      addUtilities({
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
      })
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
