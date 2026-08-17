# Env Rules

Đọc file này khi task có env/config/base URL/secret/runtime variable.

Env bắt buộc required, không optional.

## Required Env

Khi thêm env mới:

1. Khai báo schema required trong file env của dự án nếu đã có.
2. Nếu chưa có file env, tạo `src/env.ts` bằng `zod` hoặc `@t3-oss/env-core`.
3. Không dùng fallback ngầm như:
   - `import.meta.env.VITE_API_BASE_URL ?? '/api'`
   - `import.meta.env.X || 'default'`
4. Nếu env thiếu, app phải fail fast với error rõ ràng.
5. Không đọc `import.meta.env` trực tiếp rải rác trong feature/component.
6. Import env từ module env duy nhất.

Với API base URL, dùng env required vì đây là cấu hình production quan trọng.
