# React Base

Base frontend cho CMS/admin: React + TypeScript + Vite, Ant Design, Tailwind, TanStack Router/Query, Zustand, MSW.

Đọc [SKILLS.md](./SKILLS.md) trước khi tạo hoặc sửa feature. File đó là router rule cho AI và dev.

## Chạy

```bash
yarn install
yarn dev          # http://localhost:3001, mock API bật sẵn (MSW)
yarn validate        # type + lint + format
yarn test
yarn build
```

Tài khoản mock: `admin@example.com` / `123456`.

Node `>=22` LTS (xem `.nvmrc`, `nvm use`). Node 20 đã hết hạn hỗ trợ. Pre-commit chạy lint-staged; CI chạy `validate`, `test`, `build`.

## Cấu Trúc

Feature-first: mỗi feature tự chứa mọi thứ của nó, tầng chung mỏng.

```text
src/
  app/            Bootstrap: router, providers, theme, devtools, layout (AppShell/Header/Sidebar)
  components/     UI dùng chung, không biết feature: layout/, ui/, feedback/
  features/       Mỗi feature: api.ts, types.ts, hooks/, components/, pages/ (+ store, search, guards nếu cần)
    auth/         Login/register/me, store, role guard
    projects/     CRUD mẫu: filter qua URL, phân trang server, form modal, xoá có confirm
    dashboard/
    settings/     Route chỉ admin (ví dụ requireRole)
  lib/            Tầng thấp nhất: http, env, api-error, api-response, auth-storage, url, endpoints, query-client
  mocks/          MSW handlers + data, chỉ load ở dev khi VITE_ENABLE_MOCK_API=true
  routes/         TanStack Router file-based routes, chỉ khai báo route và import page
  styles/         Global CSS + design tokens
  test/           Vitest setup
```

Quy tắc phụ thuộc (ESLint enforce): `lib` không import gì ở tầng trên; `components` không import `features`/`app`; `axios` chỉ trong `lib/http.ts`.

## Luồng Thêm Feature Có API

```text
features/<x>/types.ts        model + payload + list params
lib/endpoints.ts             thêm endpoint
features/<x>/api.ts          gọi http + unwrapResponse
features/<x>/hooks/          queryOptions/useQuery/useMutation, key factory, toast
features/<x>/components/     UI riêng của feature
features/<x>/pages/          compose page
routes/_app/<x>.tsx          createFileRoute + validateSearch nếu có query param
mocks/handlers/<x>.ts        handler MSW để chạy local
```

Ví dụ đầy đủ: `features/projects`.

## Auth

- Token: `lib/auth-storage.ts` là source of truth. Zustand (`features/auth/store.ts`) chỉ giữ `user`, `isAuthenticated`.
- Guard: `routes/_app/route.tsx` đọc `useAuthStore.getState()`, gọi `/me` qua `queryClient.ensureQueryData`, hydrate user. `routes/auth/route.tsx` đẩy user đã đăng nhập về `/`.
- Role: `requireRole(Role.ADMIN)` trong `beforeLoad` throw `ForbiddenError`, `RouteError` render trang 403.
- Refresh token: `lib/http.ts` gom các request 401 vào một lần refresh; thất bại thì clear storage và về login.

## Env

Validate ở `lib/env.ts`, thiếu là throw lúc khởi động.

| File                         | Commit | Dùng khi                   |
| ---------------------------- | ------ | -------------------------- |
| `.env`                       | có     | mọi mode, production build |
| `.env.development`           | có     | `yarn dev`                 |
| `.env.local`, `.env.*.local` | không  | override riêng máy         |

`VITE_*` luôn public, không đặt secret.

## Quy Ước Nhanh

- File kebab-case, component/hook export PascalCase/`useX`.
- UI text tiếng Việt có dấu.
- Ant Design trước, Tailwind cho layout/spacing. Chỉnh AntD qua token trong `app/theme.ts`, không override CSS bằng `!important`.
- Lỗi API là `ApiError`; UI lấy message qua `getErrorMessage`.
