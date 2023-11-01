/// <reference types="@histoire/plugin-vue/components" />
/// <reference types="vite/client" />


interface ImportMetaEnv {
  readonly VITE_GOOGLE_PLACES_API_KEY: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}