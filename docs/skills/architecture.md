# Architecture Rules

Đọc khi tạo/sửa folder, feature, model, hook, component, page, route, store, hoặc refactor.

## Cấu Trúc Feature-First

```text
src/
  app/          bootstrap + layout app (router, providers, theme, AppShell, Header, Sidebar)
  components/   UI dùng chung, không biết feature
  features/     mỗi feature một folder, tự chứa mọi thứ của nó
  lib/          tầng thấp nhất: http, env, error, response, storage, url, endpoints, query-client
  mocks/        MSW handlers + data (chỉ dev)
  routes/       TanStack file routes, chỉ khai báo route + import page
  styles/       global CSS + tokens
```

Chiều phụ thuộc (ESLint enforce):

```text
routes -> features -> components -> lib
app    -> features, components, lib
```

- `lib` không import React, AntD, hay bất kỳ tầng trên nào.
- `components` không import `features`/`app`. Component có logic feature thì đặt trong `features/<x>/components`.
- `axios` chỉ xuất hiện trong `lib/http.ts`.
- Feature không import feature khác trừ `features/auth` (store/guards/types là app-level). Nếu hai feature cần chung code, đưa xuống `components` hoặc `lib`.

## Bên Trong Một Feature

```text
features/<x>/
  types.ts          model, payload, list params, label map
  api.ts            gọi http + unwrapResponse, không toast, không transform UI
  search.ts         zod schema cho query param của route (nếu có)
  hooks/            key factory, queryOptions, useQuery, useMutation, toast, invalidate
  components/       UI riêng của feature, nhận props, không gọi API trực tiếp
  pages/            compose components + hooks; là nơi duy nhất orchestration
  store.ts          Zustand nếu feature có shared client state
  guards.ts         helper cho beforeLoad (chỉ auth có)
```

Không phải feature nào cũng cần đủ file. Dashboard chỉ có `pages/`.

## Thứ Tự Làm Feature Mới

1. `rg` xem đã có chưa.
2. `types.ts`.
3. `lib/endpoints.ts`.
4. `api.ts`.
5. `hooks/`.
6. `mocks/handlers/<x>.ts` để chạy local.
7. `components/` rồi `pages/`.
8. `routes/_app/<x>.tsx` (file phẳng; chuyển sang folder `routes/_app/<x>/` khi có route con).

## State Ownership

```text
useState/useReducer = UI local (modal open, tab, selected row, form draft)
Zustand             = shared client state (auth user, sidebar collapsed, workspace đang chọn)
TanStack Query      = server state (list/detail, /me, mọi thứ từ API)
URL search params   = filter/pagination/sort của list page (share link, back/forward đúng)
```

- Không copy query data vào Zustand hay `useState` để render.
- Filter/pagination của list đi qua `validateSearch` + `navigate({ search })`, không `useState`. Mẫu: `features/projects/pages/projects-page.tsx`.
- Zustand selector phải hẹp: `useAuthStore((s) => s.user)`.

## Naming

- File và folder: kebab-case. `project-form-modal.tsx`, `use-projects.ts`, `auth-storage.ts`.
- Component/page export: PascalCase. `export function ProjectFormModal() {}`.
- Hook: `useX`. `export function useProjects() {}`.
- API object: `<feature>Api`. `projectsApi.list()`.
- Query key factory: `<feature>Keys`. `projectKeys.list(params)`.
- Page: `<x>-page.tsx`, export `XPage`.
- Route: `export const Route = createFileRoute(...)`.
- Không trộn PascalCase file với kebab-case file trong cùng repo.

## Kích Thước

- File dưới 400 dòng. Gần tới thì tách: columns, form, filter, sub component, hook.
- Không tạo component bên trong component khác.
- Không viết helper/transform lớn trong JSX.
