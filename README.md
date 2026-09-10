# React Base

Base frontend cho CMS/admin: React 19 + React Compiler, TypeScript, Vite, Ant Design, Tailwind, TanStack Router/Query, Zustand, MSW, pnpm.

Rule cho người và AI: [AGENTS.md](./AGENTS.md) (cách làm task, định nghĩa xong) và [SKILLS.md](./SKILLS.md) (chọn rule phụ).

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
```

Tài khoản mock (mật khẩu `123456`): `admin@example.com` có mọi quyền, `user@example.com` không xoá dự án và không vào Cài đặt.

CI: mỗi PR chạy validate, test có coverage, build, size. E2E chỉ khi merge `main`, PR gắn label `e2e`, hoặc chạy tay.

## Cấu trúc

```text
src/
  app/            Bootstrap: router, providers, tokens, theme, i18n, monitoring, layout
  components/     UI dùng chung, không biết feature: layout/, ui/, feedback/, hooks/
  features/       Mỗi feature: types, api, search, hooks/, components/, pages/
    auth/         Login, store, permission theo hành động, guard
    projects/     CRUD mẫu đầy đủ, copy pattern từ đây
    dashboard/    Cards + infinite list theo cursor
    settings/     Route cần permission
  lib/            Tầng thấp nhất, không React: http, env, format, storage, monitoring...
  locales/        en.json; tiếng Việt là key nên không cần file
  mocks/          MSW handlers, chỉ load ở dev khi VITE_ENABLE_MOCK_API=true
  routes/         TanStack file routes, chỉ khai báo route
e2e/              Playwright: auth, CRUD, permission, i18n, mobile, a11y
scripts/          gen feature, check cấu trúc, bundle size
deploy/           nginx template + security headers
```

Chiều phụ thuộc `routes → features → components → lib`, ESLint chặn vi phạm. Chi tiết: `docs/skills/architecture.md`.

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
