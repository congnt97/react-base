# API Rules

Đọc file này khi task có API, endpoint, data fetching, mutation, TanStack Query, repository impl, response/error.

Không call API trực tiếp trong component/container/page.

## Flow Bắt Buộc

```text
domain model
-> application repository interface
-> shared endpoint
-> infrastructure repository impl
-> presentation hook
-> container/page
```

Ví dụ Auth:

```text
domain/models/Auth.ts
application/repositories/AuthRepository.ts
shared/endpoints.ts
infrastructure/repositories/AuthRepositoryImpl.ts
presentation/hooks/auth/useLogin.tsx
presentation/features/auth/containers/LoginForm.tsx
```

Ví dụ Project:

```text
domain/models/Project.ts
application/repositories/ProjectsRepository.ts
shared/endpoints.ts
infrastructure/repositories/ProjectsRepositoryImpl.ts
presentation/hooks/projects/useProjects.ts
presentation/features/projects/containers/ProjectsContainer.tsx
```

## Repository Impl

- Dùng `useGetApi`, `usePostApi`, `usePutApi`, `usePatchApi`, `useDeleteApi` nếu dự án có các helper này; nếu không, dùng `httpClient`/`useApiQuery`/`useApiMutation` theo base hiện tại.
- Endpoint lấy từ `src/shared/endpoints.ts`.
- Return type phải có generic rõ ràng.
- Không hardcode URL trong hook/component.
- Không toast trong repository impl.

## Presentation Hook

- Đặt trong `src/presentation/hooks/<feature>/useXxx.tsx`.
- Chịu trách nhiệm transform response, toast, invalidate query nếu cần.
- Không render JSX.

## TanStack Query

- Query key phải ổn định và có endpoint/params.
- Mutation phải invalidate/refetch đúng query liên quan.
- Không clear toàn bộ query client nếu chỉ cần invalidate feature scope, trừ auth/logout.

## React Query Cache Rules

Dùng React Query cache khi data là server truth và có khả năng được đọc lại:

- List/detail API được dùng ở nhiều component/page.
- Quay lại page không muốn loading lại ngay.
- Cần đồng bộ list/detail sau mutation.
- Data có query key rõ ràng theo endpoint/params.
- Cần refetch, stale time, retry, loading/error state từ server.

Không cần React Query cache cho:

- UI local state: modal, drawer, selected tab, hover/focus.
- Form draft đang nhập chưa submit.
- Derived data tính từ props/state có sẵn.
- Static data hardcoded trong component.
- Event transient.

Không đưa server data vào Zustand để "cache lại". Nếu cần cache server data, dùng query key và invalidate đúng scope.

Mutation rules:

- Create/update/delete xong phải invalidate query liên quan.
- Invalidate list khi tạo/xóa item.
- Invalidate detail và list khi update item nếu cả hai đang được dùng.
- Auth logout mới được clear query client rộng.

## Error Handling

- Dùng `FormattedError`/`getFormattedErrorMessage` nếu phù hợp.
- Toast ở presentation hook/container, không ở repository impl.
