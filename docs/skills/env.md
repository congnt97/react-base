# Env Rules

Đọc khi có env, config, base URL, secret.

## Máy đã ép

`lib/env.ts` validate bằng zod, thiếu là throw lúc khởi động. `src/vite-env.d.ts` khai kiểu nên `import.meta.env.X` không phải `any`. Tên `VITE_*` chứa `SECRET|PRIVATE|PASSWORD|TOKEN` bị ESLint chặn.

## Rule

- Import `env` từ `lib/env.ts`, không đọc `import.meta.env` rải rác, không fallback ngầm kiểu `?? 'default'`.
- Thêm env mới: schema trong `lib/env.ts`, kiểu trong `src/vite-env.d.ts`, giá trị trong `.env` và `.env.development`.
- `VITE_*` luôn bundle ra client. Không đặt secret.

| File                         | Commit | Dùng khi                   |
| ---------------------------- | ------ | -------------------------- |
| `.env`                       | có     | mọi mode, production build |
| `.env.development`           | có     | `pnpm dev`                 |
| `.env.local`, `.env.*.local` | không  | override riêng máy         |
