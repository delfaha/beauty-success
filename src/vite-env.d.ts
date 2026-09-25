/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** URL publique du site, utilisée pour les URL canoniques et les données structurées. */
  readonly VITE_SITE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
