# API Rules

Đọc khi có API, endpoint, query/mutation, cache, response/error, pagination, mock.

## Máy đã ép

- Endpoint trong `lib/endpoints.ts` không có MSW handler: `src/mocks/handlers.test.ts` đỏ.
- Promise bỏ lửng, `await` thiếu, throw không phải Error: typed lint.
- Query key/hook sai cách dùng: `@tanstack/eslint-plugin-query`.
- `axios` ngoài `lib/http.ts`: ESLint chặn.

Không gọi `axios` hay `http` trong component/page. Component gọi hook, hook gọi `api.ts`.

## Flow

```text
features/<x>/types.ts -> lib/endpoints.ts -> features/<x>/api.ts -> features/<x>/hooks/ -> components/pages
```

Mẫu đầy đủ: `features/projects`.

## `api.ts`

Mỗi `api.ts` khai báo `interface <Feature>Api` trước, rồi `export const <feature>Api: <Feature>Api`. Interface là contract với backend: đọc nó là biết feature gọi gì, nhận gì, không cần đọc phần gọi `http`. Sửa contract thì sửa interface trước, TypeScript sẽ chỉ chỗ cần cập nhật.

```ts
export interface ProjectsApi {
  list: (params: ProjectListParams) => Promise<PaginatedResponse<Project>>;
  update: (id: string, body: ProjectPayload) => Promise<Project>;
}

export const projectsApi: ProjectsApi = {
  list: async (params: ProjectListParams) =>
    unwrapResponse(
      await http.get<ApiResponse<PaginatedResponse<Project>>>(
        Endpoints.Projects.LIST,
        { queryParams: params },
      ),
    ),
  update: async (id: string, body: ProjectPayload) =>
    unwrapResponse(
      await http.put<ApiResponse<Project>, ProjectPayload>(
        Endpoints.Projects.DETAIL,
        body,
        { urlParams: { id } },
      ),
    ),
};
```

- Interface trước, implementation sau; kiểu tham số/kết quả nằm ở interface, implementation không lặp lại.
- Generic response luôn rõ: `ApiResponse<T>` rồi `unwrapResponse`.
- Method đọc (`list`, `detail`) nhận `options?: { signal }` và truyền vào `http`; hook viết `queryFn: ({ signal }) => api.list(params, { signal })` để TanStack huỷ request cũ khi đổi trang/filter.
- `lib/http.ts` gắn `X-Request-Id` mỗi request; `ApiError.requestId` đi theo lỗi lên monitoring để tra log backend.
- Endpoint từ `lib/endpoints.ts`, không hardcode URL.
- Không toast, không transform UI trong `api.ts`. Chuẩn hoá DTO của backend thành type của app thì làm ở đây (mẫu: `toAuthUser` trong `features/auth/api.ts`), để phần còn lại của app không biết backend trả hình dạng gì.

## Hooks

Key factory + `queryOptions` để route `beforeLoad`/`loader` và component dùng chung:

```ts
export const projectKeys = {
  all: ['projects'] as const,
  list: (params: ProjectListParams) =>
    [...projectKeys.all, 'list', params] as const,
};

// `export` chỉ khi route loader dùng (như projectDetailQueryOptions); không thì để nội bộ, knip sẽ báo export thừa.
const projectsQueryOptions = (params: ProjectListParams) =>
  queryOptions({
    queryKey: projectKeys.list(params),
    queryFn: () => projectsApi.list(params),
    placeholderData: keepPreviousData,
  });
```

- Query key phải chứa mọi param mà `queryFn` dùng. Object trong key là bình thường, TanStack hash ổn định không phụ thuộc thứ tự field.
- Method API: `list/detail/create/update/patch/remove`. Hành động hàng loạt là `<verb>Many` với một request nhiều id (`patchMany`), list con theo id cha là `list<Con>` (`listSessions`). Mẫu: `features/members/api.ts`.
- Feature không gọi `useQuery` thẳng (ESLint chặn). List dùng `useListQuery`, detail dùng `useDetailQuery` từ `core/hooks/`: `isLoading` đúng nghĩa (query tắt không kẹt loading), `signal` sẵn, giữ data cũ khi đổi trang, tự báo `onPageOverflow` khi xoá dòng cuối của trang cuối. Mẫu: `features/projects/hooks/use-projects.ts`, `use-project.ts`.
- `enabled: Boolean(id)` khi param bắt buộc có thể `undefined`. `queryOptions` tách riêng khi route loader cần prefetch (`projectDetailQueryOptions`).
- Mutation: toast + `invalidateQueries({ queryKey: projectKeys.all })`. Chỉ auth/logout mới `queryClient.clear()`.
- Không fetch bằng `useEffect` + `useState`.

## Xử Lý 3 Trạng Thái

```tsx
const list = useProjects(search, { onPageOverflow: (page) => void updateSearch({ page }) });
if (list.isError) return <ErrorState error={list.error} onRetry={list.refetch} />;
<DataTable list={list} page={search.page} pageSize={search.pageSize} emptyState={…} … />;
```

Không chỉ `data && ...` rồi im lặng khi lỗi. Không đọc `isPending` của query để hiện loading; dùng `isLoading` mà core đã tính.

## Error

- Mọi lỗi API là `ApiError` (`lib/api-error.ts`) với `message`, `statusCode`. `lib/http.ts` và `unwrapResponse` đã chuẩn hoá; MSW handler trả `{ statusCode, message }` để interceptor map đúng.
- UI lấy message qua `getErrorMessage(error)`, không đọc `error.response`.
- Toast dùng `App.useApp().message` của AntD. Không thêm thư viện toast khác.
- Toast ở hook/page, không ở `api.ts`.

## Pagination

Envelope chung trong `lib/api-response.ts`:

```ts
type PaginatedResponse<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
};
```

Page truyền `list` từ `useListQuery` và `page/pageSize` từ URL vào `DataTable`, không tự giữ state phân trang song song. `page/pageSize/filter` nằm trên URL (xem `routing-auth.md`).

## Optimistic Update

Chỉ dùng cho thao tác nhỏ, tỉ lệ lỗi thấp, user cần phản hồi tức thì (đổi trạng thái, toggle, sắp xếp). Mẫu: `useUpdateProjectStatus` trong `features/projects/hooks/use-project-mutations.ts`.

Bắt buộc đủ 4 bước: `onMutate` cancel query + lưu snapshot + `setQueriesData`; `onError` rollback từ snapshot + toast; `onSettled` invalidate. Thiếu rollback thì UI sai khi server lỗi.

Create/delete vẫn dùng invalidate thường, không optimistic.

## Infinite List (Cursor)

List dạng feed/"Tải thêm" dùng `useInfiniteQuery` với envelope `CursorPage<T>` (`items`, `nextCursor`), `nextCursor: null` là hết. Mẫu: `features/dashboard/hooks/use-activity.ts` + `components/activity-feed.tsx`.

Bảng có phân trang số trang vẫn dùng `PaginatedResponse<T>`; không trộn hai kiểu trong một màn.

## Upload

Dùng `components/ui/upload.tsx` với `accept` (MIME whitelist) và `maxSizeMb`; giá trị là URL string nên đặt thẳng trong `Form.Item`. Hàm upload dùng chung ở `lib/upload.ts`. Client validate chỉ để UX, backend phải validate lại.

## Mock (MSW)

- Handler đặt trong `mocks/handlers/<feature>.ts`, đăng ký ở `mocks/handlers/index.ts`.
- Dùng `apiUrl(Endpoints...)`, `ok(data)`, `fail(status, message)` từ `mocks/utils.ts` để giữ đúng envelope.
- Data in-memory trong handler, reset khi reload. Không đặt mock data trong `features/`.
- Bật/tắt bằng `VITE_ENABLE_MOCK_API`; production không bundle `mocks/`.
