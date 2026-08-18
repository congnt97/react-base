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
- Toast dùng `App.useApp().message` của Ant Design (đã setup qua `<AntdApp>` trong `main.tsx`). Không thêm thư viện toast khác (`sonner`, `react-hot-toast`...) — base đã gỡ `sonner` vì gây 2 hệ thống toast song song không nhất quán.

## Pagination / List Response

Danh sách từ API dùng envelope pagination, không tự chế field rời rạc. Định nghĩa 1 type dùng chung trong `application/dto/response`:

```ts
export type PaginatedResponse<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
};
```

Repository trả `Promise<PaginatedResponse<Project>>`; container truyền `total`/`page`/`pageSize` thẳng vào `Table` `pagination` prop của Ant Design, không tự tính lại state phân trang song song với response.

Query key phải gồm `page`/`pageSize`/filter (giá trị nguyên thủy, xem `docs/skills/hooks.md` và mục "Lỗi Thường Gặp" bên dưới) để mỗi trang là 1 cache entry riêng.

## Lỗi Thường Gặp Khi Dùng TanStack Query

### Query key không ổn định

Không làm — object/array literal tạo mới mỗi render khiến cache miss liên tục:

```ts
useApiQuery({
  queryKey: ['projects', { page, filter }],
  queryFn: () => projectsRepository.list({ page, filter }),
});
```

Nên làm — dùng giá trị nguyên thủy trong key hoặc `useMemo` cho object filter nếu cần giữ nguyên tham chiếu:

```ts
useApiQuery({
  queryKey: ['projects', page, filter.status, filter.keyword],
  queryFn: () => projectsRepository.list({ page, filter }),
});
```

### Thiếu `enabled` guard

Không gọi query khi param bắt buộc còn `undefined`/`null`:

```ts
useApiQuery({
  queryKey: ['project', id],
  queryFn: () => projectsRepository.detail(id),
  options: { enabled: Boolean(id) },
});
```

### Fetch qua `useEffect` + axios thay vì Query

Không dùng `useEffect` để tự fetch rồi tự quản `isLoading`/`data`/`error` bằng `useState`. Luôn đi qua repository + `useApiQuery`/`useApiMutation` để có sẵn cache, retry, loading/error state. Xem thêm `docs/skills/hooks.md`.

### Không xử lý `isLoading`/`isError`

Không làm — chỉ check `data &&` rồi im lặng khi lỗi hoặc đang tải:

```tsx
{data && <ProjectList projects={data} />}
```

Nên làm — xử lý đủ 3 trạng thái:

```tsx
if (isLoading) return <Spin />;
if (isError) return <ErrorState message={getFormattedErrorMessage(error)} />;
return <ProjectList projects={data} />;
```
