/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_ENABLE_MOCKS?: string;
  readonly VITE_FEATURE_ADMIN_INSIGHTS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
