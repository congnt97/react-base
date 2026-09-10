# Routing And Auth Rules

Đọc khi có auth, token, route, guard, role, protected page, query param.

## Máy đã ép

- `throw redirect()`/`throw notFound()` được ESLint cho phép riêng; throw thứ khác không phải Error là lỗi.
- Luồng refresh token (401 → refresh một lần → retry, thất bại → clear + báo hết phiên): `lib/http.test.ts`.
- Permission và `requirePermission`: `permissions.test.ts`, `guards.test.ts`; E2E kiểm user thường không thấy nút xoá và bị 403.
- Chưa ép được: route có query param mà quên `validateSearch`. Tự kiểm khi thêm route list.

## Auth Flow

- Token: `lib/auth-storage.ts` là source of truth. Zustand `features/auth/store.ts` chỉ giữ `user`, `isAuthenticated`.
- `lib/http.ts` đọc token từ storage; gặp 401 thì refresh một lần (gom nhiều request), thất bại thì `clearAuthStorage` + `notifySessionExpired`.
- `app/router.tsx` đăng ký `subscribeSessionExpired` để clear store, clear query cache và về `/auth/login`.
- `routes/_app/route.tsx`: guard + hydrate user qua `queryClient.ensureQueryData(meQueryOptions())`.
- `routes/auth/route.tsx`: đã đăng nhập thì về `/`.
- Logout (`use-logout.ts`): `onSettled` clear store, clear query, về login, dù server lỗi.

Guard đọc `useAuthStore.getState()` chứ không đọc router context. `beforeLoad` chạy đồng bộ ngay khi `navigate()` được gọi trong `onSuccess`/`onSettled`, trước khi React re-render, nên đọc từ context sẽ thấy giá trị cũ và redirect sai.

## Permission

Một cơ chế duy nhất: permission theo hành động `<resource>:<action>` trong `features/auth/permissions.ts`, map từ role qua `ROLE_PERMISSIONS`. Không check `user.role === 'admin'` rải rác.

| Nơi dùng              | Cách dùng                                                                                                |
| --------------------- | -------------------------------------------------------------------------------------------------------- |
| Route                 | `beforeLoad: () => requirePermission('settings:manage')` throw `ForbiddenError`, `RouteError` render 403 |
| JSX                   | `<Can permission="projects:create">...</Can>`                                                            |
| Logic trong component | `const { can } = usePermissions(); can('projects:delete')`                                               |
| Ngoài React           | `can(user, 'projects:read')`                                                                             |

Thêm permission mới: thêm vào `PERMISSIONS`, cấp cho role trong `ROLE_PERMISSIONS`, viết test trong `permissions.test.ts`. Frontend guard chỉ là UX, backend phải enforce.

Mock có hai tài khoản để thấy khác biệt: `admin@example.com` (tất cả) và `user@example.com` (không xoá dự án, không vào Cài đặt), mật khẩu `123456`.

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

## Route Có Param (detail)

Mẫu: `routes/_app/projects/$id.tsx` + `features/projects/pages/project-detail-page.tsx`.

- List và detail là anh em trong folder: `projects/index.tsx` (`/projects`) và `projects/$id.tsx` (`/projects/:id`). Không đặt `projects.tsx` cạnh folder `projects/` vì nó sẽ thành layout cha và cần `<Outlet>`.
- `loader` gọi `queryClient.ensureQueryData(<feature>DetailQueryOptions(params.id))` để render lần đầu có data ngay; component vẫn dùng `use<Entity>(id)` để cache đồng bộ sau mutation.
- API trả 404 thì loader `throw notFound()` để hiện trang Not Found chung, không hiện ErrorState.
- Page lấy param qua `getRouteApi('/_app/projects/$id').useParams()`. Link tới detail: `<Link to="/projects/$id" params={{ id }}>`.
- `PageHeader` nhận `breadcrumbs` để quay về list.

## redirectTo

`features/auth/search.ts` chỉ nhận đường dẫn nội bộ (`/...`, không `//`) để chặn open redirect.
