/// <reference types="vite/client" />

// Khai báo để import.meta.env.VITE_* có kiểu string | undefined thay vì any.
// Validate thật nằm ở lib/env.ts; thêm env mới thì thêm cả hai chỗ.
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string;
  readonly VITE_ENABLE_MOCK_API?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
