/// <reference types="vite/client" />

// Declared so import.meta.env.VITE_* is typed string | undefined instead of any.
// Real validation lives in lib/env.ts; adding a new env var means updating both places.
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_ENABLE_MOCK_API?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
