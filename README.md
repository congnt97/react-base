# React Base

Base frontend cho CMS/admin: React 19 + React Compiler, TypeScript, Vite, Ant Design, Tailwind, TanStack Router/Query, Zustand, MSW, pnpm.

Rule cho người và AI: [AGENTS.md](./AGENTS.md) (cách làm task, định nghĩa xong) và [SKILLS.md](./SKILLS.md) (chọn rule phụ). Giải thích dài có ví dụ: [docs/handbook.md](./docs/handbook.md). Vì sao base chọn như vậy: [docs/decisions.md](./docs/decisions.md).

## 30 phút đầu cho người mới

1. Chạy `pnpm dev`, đăng nhập `admin@example.com` / `123456`, bấm qua Dự án và Thành viên để thấy mọi mẫu UI đang có.
2. Đọc [AGENTS.md](./AGENTS.md) (5 phút): cách làm một task, thế nào là xong, những gì không được làm.
3. Đọc `src/features/projects` từ `types.ts` → `api.ts` → `hooks/` → `components/` → `pages/` (10 phút). Đây là CRUD chuẩn; feature mới sinh từ `pnpm gen` sẽ giống hệt.
4. Đọc `src/features/members` (10 phút) để thấy phần khó hơn: chọn nhiều dòng và hành động hàng loạt, drawer form với select tìm từ server, bảng con phân trang trên URL, lỗi field từ backend hiện đúng field.
5. Lướt `docs/skills/pitfalls.md`: mỗi lỗi hay gặp và thứ trong base chặn nó. Khi viết code mà thấy mình đang "tự xử lý loading/click/modal", dừng lại và tìm hook core hoặc adapter tương ứng.

Cách base chặn lỗi: hành vi khó (khoá click, khoá modal khi gửi, loading đúng, trang tràn, huỷ request cũ) nằm trong `src/core/` và không phụ thuộc Ant Design; `src/components/ui/` bọc Ant Design và là chỗ duy nhất feature được lấy `Button, Modal, Table, Popconfirm, Upload, Drawer, Form`. ESLint chặn import thẳng. Đổi thư viện UI thì viết lại các adapter đó và chạy lại test hành vi của chúng.

## Chạy

```bash
corepack enable && nvm use   # Node 22, pnpm theo packageManager
pnpm install
pnpm dev                      # http://localhost:3001, mock API bật sẵn (MSW)
pnpm validate                 # type, lint, format, cấu trúc, code chết
pnpm test                     # unit + component (test:coverage để xem ngưỡng)
pnpm test:e2e                 # Playwright; lần đầu: pnpm exec playwright install chromium
pnpm build && pnpm size       # build + bundle budget
pnpm gen <tên>                # sinh feature CRUD mới
pnpm tokens:css               # sinh lại biến CSS từ design-tokens.json
```

Tài khoản mock (mật khẩu `123456`): `admin@example.com` có mọi quyền, `user@example.com` không xoá dự án và không vào Cài đặt.

CI: mỗi PR chạy validate, test có coverage, build, size. E2E chỉ khi merge `main`, PR gắn label `e2e`, hoặc chạy tay.

## Cấu trúc

```text
src/
  app/            Bootstrap: router, providers, tokens, theme, i18n, monitoring, layout
  components/     UI dùng chung, không biết feature: layout/, feedback/, ui/ (adapter Ant Design)
  core/           Hành vi headless dùng chung: useAsyncAction, useListQuery, useAsyncOptions... không biết UI lib
  features/       Mỗi feature: types, api, search, hooks/, components/, pages/
    auth/         Login, store, permission theo hành động, guard
    projects/     CRUD mẫu cơ bản, copy pattern từ đây
    members/      Mẫu phức tạp: chọn nhiều + hàng loạt, drawer form, select tìm server, bảng con
    dashboard/    Cards + infinite list theo cursor
    settings/     Route cần permission
  lib/            Tầng thấp nhất, không React: http, env, format, storage, monitoring...
  locales/        en.json; tiếng Việt là key nên không cần file
  mocks/          MSW handlers, chỉ load ở dev khi VITE_ENABLE_MOCK_API=true
  routes/         TanStack file routes, chỉ khai báo route
e2e/              Playwright: auth, CRUD, thành viên, permission, i18n, mobile, a11y
scripts/          gen feature, check cấu trúc, bundle size, sinh CSS token
deploy/           nginx template + security headers
```

Chiều phụ thuộc `routes → features → components → core → lib`, ESLint chặn vi phạm. Chi tiết: `docs/skills/architecture.md`.

## Env

Validate ở `lib/env.ts`, thiếu là throw lúc khởi động. `VITE_*` luôn public, không đặt secret.

| File                         | Commit | Dùng khi                   |
| ---------------------------- | ------ | -------------------------- |
| `.env`                       | có     | mọi mode, production build |
| `.env.development`           | có     | `pnpm dev`                 |
| `.env.local`, `.env.*.local` | không  | override riêng máy         |

## Deploy

```bash
docker build -t react-base --build-arg VITE_API_BASE_URL=/api .
docker run -p 8080:80 -e API_UPSTREAM=http://api:3000 react-base
```

nginx serve `dist/`, SPA fallback, cache dài cho `/assets/`, proxy `/api/` sang `API_UPSTREAM` đổi lúc chạy, security headers (CSP, nosniff, frame DENY) ở `deploy/security-headers.conf`, healthcheck `/healthz`.

## Monitoring

`lib/monitoring.ts` và `lib/analytics.ts` là điểm cắm, không kéo SDK để giữ bundle nhẹ. Dự án thật thêm Sentry/PostHog ở `app/monitoring.ts`. Lỗi query, route, window và `X-Request-Id` đã tự đi qua đó.
