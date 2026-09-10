# Naming Rules

Đọc khi đặt tên bất kỳ thứ gì: file, folder, biến, hàm, type, hook, component, API, query key, permission, i18n key, event, branch, commit.

Mục tiêu: nhìn tên là biết nó là gì, nằm ở đâu, làm gì. Grep một từ ra đúng chỗ. Stack trace và React DevTools hiện đúng tên.

## Máy đã ép

File/folder kebab-case (`check-file`), type PascalCase, interface không prefix `I`, enum member UPPER_CASE, biến/hàm đúng format (`naming-convention`), cấm default export. Phần còn lại trong file này là quy ước, ESLint không hiểu ngữ nghĩa.

## Tổng Quan

| Thứ                           | Quy tắc                                       | Ví dụ                                       |
| ----------------------------- | --------------------------------------------- | ------------------------------------------- |
| File, folder                  | kebab-case (ESLint ép)                        | `project-form-modal.tsx`, `use-projects.ts` |
| Component                     | PascalCase, `export function`, tên = tên file | `ProjectFormModal`                          |
| Hook                          | `useX`, camelCase                             | `useProjects`, `usePermissions`             |
| Biến, hàm                     | camelCase                                     | `updateSearch`, `confirmDelete`             |
| Hằng module-level             | UPPER_SNAKE                                   | `PROJECT_STATUSES`, `DEFAULT_VALUES`        |
| Type, interface               | PascalCase, không prefix `I`/`T` (ESLint ép)  | `Project`, `ProjectsApi`                    |
| Enum member                   | UPPER_SNAKE (ESLint ép)                       | `Role.ADMIN`                                |
| Boolean                       | prefix `is`, `has`, `can`, `should`           | `isEdit`, `hasNextPage`, `canUpdate`        |
| Event handler trong component | `handleX`                                     | `handleSubmit`                              |
| Callback prop                 | `onX`                                         | `onSubmit`, `onPageChange`                  |
| Env                           | `VITE_UPPER_SNAKE`                            | `VITE_API_BASE_URL`                         |
| CSS class tự viết, CSS var    | `app-*`, `--kebab`                            | `.app-card`, `--text-muted`                 |

Không viết tắt tuỳ tiện (`btn`, `usr`, `prj`). Chấp nhận các từ đã phổ biến: `id`, `url`, `api`, `http`, `params`, `props`, `ref`, `e2e`.

Không `default export` trong `src/` (ESLint ép). Named export giữ tên trong stack trace, DevTools và khi rename bằng IDE.

## File Và Folder

```text
features/<feature>/
  types.ts                       model + payload + params
  api.ts                         interface <Feature>Api + <feature>Api
  search.ts                      <feature>SearchSchema + <Feature>Search
  store.ts                       use<Feature>Store
  hooks/use-<feature>.ts         query list
  hooks/use-<feature>-detail.ts  query detail
  hooks/use-<feature>-mutations.ts  create/update/delete gom một file
  components/<feature>-<what>.tsx   projects-table, projects-filter (số nhiều: về list)
  components/<entity>-<what>.tsx    project-form-modal, project-status-tag (số ít: về một item)
  pages/<feature>-page.tsx          ProjectsPage
  pages/<feature>-detail-page.tsx   ProjectDetailPage
```

- Feature folder số nhiều nếu là danh sách entity (`projects`), số ít nếu là khái niệm (`auth`, `dashboard`, `settings`).
- Component dùng chung trong `components/<group>/`: adapter bọc thư viện UI giữ đúng tên gốc (`Button`, `Modal`, `Upload` trong `components/ui/`), còn lại tên thường (`PageHeader`, `SearchInput`, `ErrorState`, `DataTable`).
- Test colocate cùng tên: `url.ts` -> `url.test.ts`. E2E: `e2e/<area>.spec.ts`.
- Route theo convention TanStack: tên file = URL (`_app/projects.tsx` -> `/projects`), `_app` là pathless layout, `$id` là param, `__root` là root.

## Type

| Hậu tố       | Dùng cho                                          | Ví dụ                 |
| ------------ | ------------------------------------------------- | --------------------- |
| (không)      | Model từ backend                                  | `Project`, `AuthUser` |
| `Payload`    | Body gửi lên khi create/update                    | `ProjectPayload`      |
| `ListParams` | Tham số query list                                | `ProjectListParams`   |
| `Search`     | Query param trên URL (zod)                        | `ProjectsSearch`      |
| `Response`   | Chỉ cho response thô có shape riêng               | `LoginResponse`       |
| `Props`      | Props component, không export trừ khi tái sử dụng | `ProjectsTableProps`  |
| `Api`        | Interface contract của `api.ts`                   | `ProjectsApi`         |
| `State`      | State của store                                   | `AuthState`           |

- Union string + `as const` array là mặc định: `PROJECT_STATUSES` -> `ProjectStatus`. `enum` chỉ khi cần giá trị runtime dùng ở nhiều tầng (`Role`).
- Map nhãn/màu từ union: `<X>_LABELS`, `<X>_COLORS`.
- Derive từ model thay vì copy: `Pick<Project, 'name' | 'status'>`.

## API, Query, Mutation

- Method của `api.ts` dùng đúng 6 tên, không sáng tác: `list`, `detail`, `create`, `update`, `patch`, `remove` (`delete` là từ khoá).
- Endpoint: `Endpoints.<Feature>.<UPPER>` với path REST danh từ số nhiều, param `:id`. `Endpoints.Projects.DETAIL = '/projects/:id'`.
- Key factory: `<feature>Keys` với `all`, `list(params)`, `detail(id)`. Key dạng `[feature, 'list', params]`.
- `queryOptions`: `<feature>QueryOptions`, `<feature>DetailQueryOptions`.
- Hook query: `useProjects`, `useProject(id)`. Hook mutation: `useCreateProject`, `useUpdateProject`, `useDeleteProject`, `useUpdateProjectStatus`. Tên hook nói rõ hành động, không `useProjectMutation` chung chung.
- MSW: `mocks/handlers/<feature>.ts` export `<feature>Handlers`.

## Store, Permission, i18n, Analytics

- Store: `use<X>Store`; field là danh từ (`user`, `isAuthenticated`); action là động từ `setX`, `clearX`, `toggleX`.
- Permission: `<resource>:<action>` với action trong tập cố định `read`, `create`, `update`, `delete`, `manage`. Resource số nhiều: `projects:delete`.
- i18n key: chính câu tiếng Việt có dấu, interpolation `{{name}}`. Không key kỹ thuật kiểu `projects.table.title`.
- Analytics event: `<resource>_<action_past>` snake_case: `project_created`, `login_failed`. Property camelCase.
- Toast message: câu ngắn kết quả, không dấu chấm: `Đã tạo dự án`.

## Branch Và Commit

- Branch: `<type>/<ticket>-<slug>`: `feat/CMS-123-project-attachment`, `fix/login-redirect`. Type: `feat`, `fix`, `chore`, `refactor`, `docs`, `test`.
- Commit: dòng đầu tiếng Việt, động từ đầu câu, dưới 72 ký tự, không dấu chấm cuối: `Thêm upload tài liệu cho dự án`. Body giải thích vì sao nếu không hiển nhiên.
- PR title = commit chính. Mô tả theo template.

## Rule Ngắn

```text
File kebab-case, component PascalCase, hook useX, hằng UPPER_SNAKE.
Boolean is/has/can/should. Handler handleX, prop onX.
Type không prefix I/T; hậu tố Payload/ListParams/Search/Props/Api.
API: list/detail/create/update/patch/remove; hàng loạt <verb>Many; list con list<Con>.
Không default export, không viết tắt tuỳ tiện.
```
