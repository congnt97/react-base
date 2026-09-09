# API Rules

Đọc khi có API, endpoint, query/mutation, cache, response/error, pagination, mock.

Không gọi `axios` hay `http` trong component/page. Component gọi hook, hook gọi `api.ts`.

## Flow

```text
features/<x>/types.ts -> lib/endpoints.ts -> features/<x>/api.ts -> features/<x>/hooks/ -> components/pages
```

Mẫu đầy đủ: `features/projects`.

## `api.ts`

```ts
export const projectsApi = {
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

- Generic response luôn rõ: `ApiResponse<T>` rồi `unwrapResponse`.
- Endpoint từ `lib/endpoints.ts`, không hardcode URL.
- Không toast, không transform UI trong `api.ts`.

## Hooks

Key factory + `queryOptions` để route `beforeLoad`/`loader` và component dùng chung:

```ts
export const projectKeys = {
  all: ['projects'] as const,
  list: (params: ProjectListParams) =>
    [...projectKeys.all, 'list', params] as const,
};

export const projectsQueryOptions = (params: ProjectListParams) =>
  queryOptions({
    queryKey: projectKeys.list(params),
    queryFn: () => projectsApi.list(params),
    placeholderData: keepPreviousData,
  });
```

- Query key phải chứa mọi param mà `queryFn` dùng. Object trong key là bình thường, TanStack hash ổn định không phụ thuộc thứ tự field.
- `enabled: Boolean(id)` khi param bắt buộc có thể `undefined`.
- List dùng `placeholderData: keepPreviousData` để bảng không nháy khi đổi trang.
- Mutation: toast + `invalidateQueries({ queryKey: projectKeys.all })`. Chỉ auth/logout mới `queryClient.clear()`.
- Không fetch bằng `useEffect` + `useState`.

## Xử Lý 3 Trạng Thái

```tsx
if (query.isError)
  return <ErrorState error={query.error} onRetry={query.refetch} />;
<Table
  loading={query.isPending || query.isPlaceholderData}
  dataSource={query.data?.items ?? []}
/>;
```

Không chỉ `data && ...` rồi im lặng khi lỗi.

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

Page truyền `total/page/pageSize` thẳng vào `Table.pagination`, không tự giữ state phân trang song song. `page/pageSize/filter` nằm trên URL (xem `routing-auth.md`).

## Optimistic Update

Chỉ dùng cho thao tác nhỏ, tỉ lệ lỗi thấp, user cần phản hồi tức thì (đổi trạng thái, toggle, sắp xếp). Mẫu: `useUpdateProjectStatus` trong `features/projects/hooks/use-project-mutations.ts`.

Bắt buộc đủ 4 bước: `onMutate` cancel query + lưu snapshot + `setQueriesData`; `onError` rollback từ snapshot + toast; `onSettled` invalidate. Thiếu rollback thì UI sai khi server lỗi.

Create/delete vẫn dùng invalidate thường, không optimistic.

## Infinite List (Cursor)

List dạng feed/"Tải thêm" dùng `useInfiniteQuery` với envelope `CursorPage<T>` (`items`, `nextCursor`), `nextCursor: null` là hết. Mẫu: `features/dashboard/hooks/use-activity.ts` + `components/activity-feed.tsx`.

Bảng có phân trang số trang vẫn dùng `PaginatedResponse<T>`; không trộn hai kiểu trong một màn.

## Upload

Dùng `components/ui/app-upload.tsx` với `accept` (MIME whitelist) và `maxSizeMb`; giá trị là URL string nên đặt thẳng trong `Form.Item`. Hàm upload dùng chung ở `lib/upload.ts`. Client validate chỉ để UX, backend phải validate lại.

## Mock (MSW)

- Handler đặt trong `mocks/handlers/<feature>.ts`, đăng ký ở `mocks/handlers/index.ts`.
- Dùng `apiUrl(Endpoints...)`, `ok(data)`, `fail(status, message)` từ `mocks/utils.ts` để giữ đúng envelope.
- Data in-memory trong handler, reset khi reload. Không đặt mock data trong `features/`.
- Bật/tắt bằng `VITE_ENABLE_MOCK_API`; production không bundle `mocks/`.
