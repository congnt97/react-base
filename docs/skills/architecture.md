# Architecture Rules

Đọc file này khi task tạo/sửa feature, folder, model, repository, hook, container, page, route, store, hoặc refactor trong `src/`.

## Luồng Feature Mới

1. Check file/folder đã tồn tại bằng `rg` và `find`.
2. Tạo model/type trước khi tạo API/hook/UI.
3. Tạo endpoint trong `src/shared/endpoints.ts` nếu có API.
4. Tạo repository interface ở `application`.
5. Tạo repository impl ở `infrastructure`.
6. Tạo hook ở `presentation/hooks`.
7. Tạo/reuse common component.
8. Tạo container/page.
9. Tạo route file cuối cùng.

## Folder Responsibilities

### `src/domain`

- Chứa domain model/type thuần túy.
- Không import React, Ant Design, TanStack Query, Axios, Zustand.
- Không chứa API call, UI text, toast, route, localStorage.

### `src/application`

- Chứa contract và rule ứng dụng.
- `repositories`: interface repository, không implement API.
- `dto`: response/request DTO dùng chung.
- `exceptions`: exception class.
- `services`: service interface.

### `src/infrastructure`

- Chứa implementation kết nối bên ngoài.
- `http/HttpClient.ts`: axios instance, interceptor, base URL, token.
- `hooks/useApi.ts`: hook API dùng TanStack Query.
- `repositories/*Impl.ts`: implement repository bằng API hooks.
- `services/*Impl.ts`: implement service.
- Không gọi axios trực tiếp trong component/container/page.

### `src/presentation`

- Chứa UI, route-level composition, hook UI, store UI.
- `components`: common component tái sử dụng.
- `features/<feature>/containers`: container phục vụ feature.
- `features/<feature>/<page>.tsx`: feature page composition.
- `hooks/<feature>`: hook presentation dùng repository/query/mutation.
- `layouts`: layout của app/auth/dashboard.
- `stores`: Zustand store.
- `provider`: root providers/theme/query.
- `pages`: page đặc biệt dạng route-level hiện có.
- Presentation gọi hook, hook gọi repository.

### `src/routes`

- Chứa TanStack Router file-based routes.
- Root route: `src/routes/__root.tsx`.
- Protected app route: `src/routes/_app/route.tsx`.
- Protected app pages: `src/routes/_app/<route>/route.tsx`.
- Public auth route: `src/routes/auth/route.tsx`.
- Auth pages: `src/routes/auth/login.tsx`, `src/routes/auth/register.tsx`.
- Route file chỉ nên import page và khai báo `createFileRoute`.
- Page component compose layout/container; container giữ orchestration UI của feature.

### `src/shared`

- Chứa utility, constants, endpoints, enums, validations, auth storage.
- API endpoints đặt trong `src/shared/endpoints.ts`.
- LocalStorage auth helper đặt trong `src/shared/auth-storage.ts`.
- Validation/search schema đặt trong `src/shared/validations`.
- Không import React component vào `shared`.

## State Ownership Rules

Chọn state theo ownership, không theo thói quen.

### Dùng `useState` / `useReducer`

Dùng state thuần khi state chỉ sống trong một component hoặc một cụm component gần nhau:

- Modal/drawer open close.
- Tab local trong một màn.
- Selected row trong một table.
- Filter tạm trong một page.
- Form draft chưa submit.
- Hover/focus/transient UI.
- Loading UI cục bộ không liên quan module khác.

Nếu state không cần dùng ở page/component khác, không đưa vào Zustand.

### Dùng Zustand

Dùng Zustand cho shared client state, app-level state, hoặc module-level state cần nhiều component/page cùng đọc/ghi:

- Auth UI state: `user`, `isAuthenticated`, `isLoading`.
- Sidebar collapsed/layout setting.
- Selected workspace/project đang active toàn app.
- Queue panel/editor state phức tạp chia nhiều component.
- State cần action reset/clear rõ ràng.

Không dùng Zustand cho server/API data như list project, user list, render jobs, assets, presets.

### Dùng TanStack Query

Dùng TanStack Query cho server state/API state:

- List/detail từ API.
- Current user `/me`.
- Render queue, asset library, presets.
- Mutation create/update/delete và invalidate/refetch.

Không copy API data từ React Query sang Zustand nếu không có lý do rất rõ.

Rule ngắn:

```text
useState/useReducer = UI local state
Zustand = shared client state
TanStack Query = server/API state
```
