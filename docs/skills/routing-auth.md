# Routing And Auth Rules

Đọc khi có auth, token, route, guard, role, protected page, query param.

## Auth Flow

- Token: `lib/auth-storage.ts` là source of truth. Zustand `features/auth/store.ts` chỉ giữ `user`, `isAuthenticated`.
- `lib/http.ts` đọc token từ storage; gặp 401 thì refresh một lần (gom nhiều request), thất bại thì `clearAuthStorage` + `notifySessionExpired`.
- `app/router.tsx` đăng ký `subscribeSessionExpired` để clear store, clear query cache và về `/auth/login`.
- `routes/_app/route.tsx`: guard + hydrate user qua `queryClient.ensureQueryData(meQueryOptions())`.
- `routes/auth/route.tsx`: đã đăng nhập thì về `/`.
- Logout (`use-logout.ts`): `onSettled` clear store, clear query, về login, dù server lỗi.

Guard đọc `useAuthStore.getState()` chứ không đọc router context. `beforeLoad` chạy đồng bộ ngay khi `navigate()` được gọi trong `onSuccess`/`onSettled`, trước khi React re-render, nên đọc từ context sẽ thấy giá trị cũ và redirect sai.

## Role Guard

```ts
export const Route = createFileRoute('/_app/settings')({
  component: SettingsPage,
  beforeLoad: () => requireRole(Role.ADMIN),
});
```

`requireRole` throw `ForbiddenError`; `defaultErrorComponent` (`components/feedback/route-error.tsx`) render 403. Sidebar ẩn menu theo `hasRole`. Frontend guard chỉ là UX, backend phải enforce.

## Route Rules

- Route file chỉ `createFileRoute` + import page (+ `validateSearch`, `beforeLoad`, `loader`). Không UI trong route.
- Protected: `routes/_app/<x>.tsx`. Public: `routes/auth/<x>.tsx`.
- File phẳng cho route lá; chuyển sang folder `routes/_app/<x>/route.tsx` khi có route con.
- Điều hướng bằng `navigate()`/`<Link>`, không `window.location`.
- Guard/fetch bắt buộc đặt trong `beforeLoad`/`loader`, không trong component.
- `defaultPendingComponent` đã set trong `app/router.tsx`; route chờ API sẽ hiện spinner thay vì trắng.

## Query Param

Route có query param bắt buộc có `validateSearch`. Dùng zod với `.catch` để param sai về mặc định thay vì văng lỗi:

```ts
export const projectsSearchSchema = z.object({
  page: z.number().int().min(1).catch(1),
  pageSize: z.number().int().min(1).max(100).catch(10),
  keyword: z.string().trim().min(1).optional().catch(undefined),
  status: z.enum(PROJECT_STATUSES).optional().catch(undefined),
});

export const Route = createFileRoute('/_app/projects')({
  component: ProjectsPage,
  validateSearch: (search) => projectsSearchSchema.parse(search),
});
```

Trong page:

```ts
const route = getRouteApi('/_app/projects');
const search = route.useSearch();
const navigate = route.useNavigate();
const updateSearch = (patch: Partial<ProjectsSearch>) =>
  navigate({ search: (prev) => ({ ...prev, ...patch }) });
```

Đổi filter thì reset `page: 1`.

## redirectTo

`features/auth/search.ts` chỉ nhận đường dẫn nội bộ (`/...`, không `//`) để chặn open redirect.
