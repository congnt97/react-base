# Env Rules

Đọc khi có env, config, base URL, secret.

- Khai báo required trong `lib/env.ts` bằng zod. Thiếu là throw lúc khởi động (fail fast).
- Import `env` từ `lib/env.ts`, không đọc `import.meta.env` rải rác.
- Không fallback ngầm: không `import.meta.env.X ?? 'default'`.
- Thêm env mới thì cập nhật cả `.env`, `.env.development`, `.env.example`.
- `VITE_*` luôn bundle ra client. Không đặt secret.

| File                         | Commit | Dùng khi                   |
| ---------------------------- | ------ | -------------------------- |
| `.env`                       | có     | mọi mode, production build |
| `.env.development`           | có     | `yarn dev`                 |
| `.env.local`, `.env.*.local` | không  | override riêng máy         |

Env hiện có: `VITE_API_BASE_URL`, `VITE_ENABLE_MOCK_API` (chỉ có tác dụng ở dev).
