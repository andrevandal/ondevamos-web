module.exports = {
  root: true,

  env: {
    browser: true,
    node: true,
  },

  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    parser: '@typescript-eslint/parser',
  },

  extends: [
    'plugin:@typescript-eslint/recommended',
    '@nuxtjs/eslint-config-typescript',
    'plugin:prettier/recommended',
  ],

  plugins: ['@typescript-eslint'],

  rules: {
    semi: ['error', 'never'],
    'comma-dangle': ['error', 'only-multiline'],
  },
}
