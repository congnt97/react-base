# Cẩm nang React Base

Tài liệu cho người trong team: base là gì, chạy thế nào, làm một việc thường gặp ra sao, và khi guard báo lỗi thì hiểu nó đang bảo vệ điều gì. Rule ngắn cho AI và cho review nằm ở `AGENTS.md`; file này giải thích dài hơn và có ví dụ.

Mục lục:

1. Base này là gì và không là gì
2. Chạy và các lệnh
3. Cấu trúc thư mục và chiều phụ thuộc
4. Vòng đời một request: từ URL tới màn hình
5. Tầng `core/` và adapter `components/ui/`
6. Việc thường gặp: từng bước
7. Guard: máy đang chặn gì
8. Auth, permission, route
9. UI, token, i18n, mobile, a11y
10. Test
11. Env, build, deploy, monitoring
12. Khi gặp lỗi: đọc thông báo guard thế nào

---

## 1. Base này là gì và không là gì

**Là**: lõi frontend cho CMS/admin, đã có auth, permission, CRUD mẫu, list phân trang, form, upload, optimistic update, infinite list, i18n, mock API, test ba tầng, CI, Docker. Điểm khác với một template thông thường: hành vi dễ sai (click spam, modal đóng khi đang gửi, loading kẹt, trang tràn, response cũ về sau) được đóng gói vào `src/core/` và được ép dùng bằng ESLint, không phụ thuộc vào việc người viết có nhớ hay không.

**Không là**: một design system. Ant Design là thư viện UI đang dùng, nhưng chỉ `src/components/ui/` biết điều đó. Đổi sang thư viện khác là viết lại các adapter trong folder đó và chạy lại test hành vi của chúng; `core/`, `lib/`, `features/` không đụng.

**Ba nguyên tắc chi phối mọi quyết định**:

- Máy bắt được thì để máy bắt. Rule chỉ nằm trong docs khi chưa có cách bắt bằng lint hoặc test.
- Một chỗ sửa. Token màu, endpoint, key dịch, permission: mỗi thứ có đúng một file nguồn, các nơi khác đối chiếu bằng test.
- Feature tự chứa. Mọi thứ của một màn hình nằm trong `features/<x>/`; xoá folder là xoá feature, không để lại rác.

## 2. Chạy và các lệnh

Yêu cầu: Node 22 (`.nvmrc`), pnpm theo `packageManager` (bật bằng `corepack enable`).

```bash
pnpm install
pnpm dev            # http://localhost:3001, mock API bật sẵn
```

Tài khoản mock, mật khẩu `123456`:

| Email               | Quyền                                                           |
| ------------------- | --------------------------------------------------------------- |
| `admin@example.com` | tất cả                                                          |
| `user@example.com`  | đọc/tạo/sửa dự án, đọc thành viên; không xoá, không vào Cài đặt |

Lệnh hay dùng:

| Lệnh                 | Làm gì                                                                          |
| -------------------- | ------------------------------------------------------------------------------- |
| `pnpm validate`      | type, lint (0 warning), format, cấu trúc thư mục, code chết. Chạy song song     |
| `pnpm test`          | Vitest: unit, component, các test đối chiếu                                     |
| `pnpm test:coverage` | như trên kèm ngưỡng coverage cho `lib/`, `core/`, `search/guards/permissions`   |
| `pnpm test:e2e`      | Playwright, tự bật dev server. Lần đầu: `pnpm exec playwright install chromium` |
| `pnpm build`         | `tsc --noEmit` rồi Vite build                                                   |
| `pnpm size`          | so bundle với ngân sách trong `scripts/check-bundle-size.mjs`                   |
| `pnpm gen <tên>`     | sinh feature CRUD mới, xanh ngay                                                |
| `pnpm fix`           | eslint --fix và prettier --write                                                |

Trước khi push: `pnpm validate && pnpm test`. Pre-commit (husky + lint-staged) đã lint và format file staged, nhưng không thay được hai lệnh trên.

## 3. Cấu trúc thư mục và chiều phụ thuộc

```text
src/
  app/          bootstrap: router, providers, theme, tokens, i18n, monitoring, layout (AppShell, Header, Sidebar)
  components/   UI dùng chung, không biết feature
    layout/     PageHeader
    feedback/   EmptyState, ErrorState, PageLoading, QueryBoundary, RouteError, NotFound
    ui/         adapter Ant Design: Button, Modal, DataTable, Popconfirm, Upload, Drawer, Form, SearchSelect, SearchInput, ScrollHint, useConfirm
  core/         hành vi headless: useAsyncAction, useListQuery, useDetailQuery, useAsyncOptions, useDebouncedCallback, AsyncBoundary, contracts
  features/     mỗi feature một folder tự chứa
  lib/          tầng thấp nhất, không React: http, env, endpoints, api-error, api-response, url, format, storage, upload, monitoring, analytics, query-client
  locales/      en.json (tiếng Việt là key nên không có vi.json)
  mocks/        MSW handlers + data, chỉ load ở dev khi VITE_ENABLE_MOCK_API=true
  routes/       TanStack file routes: chỉ khai báo route, validateSearch, loader, guard
  styles/       CSS toàn cục và biến :root
  test/         setup Vitest và test đối chiếu chung
```

Chiều phụ thuộc, ESLint chặn khi đi ngược:

```text
routes → features → components → core → lib
app    → features, components, core, lib
```

- `lib` không import React hay thư viện UI.
- `core` chỉ import `lib`. Không import thư viện UI.
- `components` không import `features`, `app`, `routes`.
- Feature không import feature khác, trừ `features/auth` (store, guards, permission là app-level). Cần dùng chung thì đưa xuống `components` hoặc `lib`.
- `axios` chỉ xuất hiện trong `lib/http.ts`.
- Folder mới ở `src/` bị `scripts/check-structure.mjs` chặn. Muốn thêm thì sửa script kèm lý do trong PR.

Bên trong một feature:

```text
features/<x>/
  types.ts          model, payload, list params, label map
  api.ts            interface <X>Api rồi object gọi http; không toast, không xử lý UI
  search.ts         zod schema cho query param của route
  hooks/            key factory, useListQuery/useDetailQuery, useMutation kèm toast + invalidate, hook gom state UI
  components/       UI riêng của feature, nhận props, không gọi API
  pages/            ghép components + hooks; nơi duy nhất có orchestration
```

Hai feature mẫu để đối chiếu:

- `features/projects`: CRUD cơ bản, filter trên URL, modal form, upload, optimistic update, xác nhận xoá.
- `features/members`: chọn nhiều dòng và hành động hàng loạt, drawer form với select tìm từ server, lỗi field từ backend, bảng con phân trang trên trang chi tiết.

## 4. Vòng đời một request: từ URL tới màn hình

Lấy màn danh sách dự án làm ví dụ, đi theo đúng thứ tự file:

1. **Route** `src/routes/_app/projects/index.tsx`: khai `validateSearch` bằng `projectsSearchSchema`. Query param sai (`page=abc`) được zod `.catch` đưa về mặc định, không văng lỗi.
2. **Page** `features/projects/pages/projects-page.tsx`: đọc `search` từ route, gọi `useProjects(search, { onPageOverflow })`. Đổi filter hay trang là `navigate({ search })`; URL là nguồn sự thật, không có `useState` cho filter.
3. **Hook** `features/projects/hooks/use-projects.ts`: key factory `projectKeys.list(params)` rồi `useListQuery`. Hook này trả `isLoading` đúng nghĩa, huỷ request cũ qua `signal`, giữ data cũ khi đổi trang, và gọi `onPageOverflow(lastPage)` khi trang hiện tại trống mà vẫn còn dữ liệu.
4. **API** `features/projects/api.ts`: `projectsApi.list(params, { signal })` gọi `http.get(Endpoints.Projects.LIST, { queryParams, signal })`. Endpoint chỉ khai ở `lib/endpoints.ts`.
5. **HTTP** `lib/http.ts`: gắn Bearer token và `X-Request-Id`, timeout 30 giây, gặp 401 thì refresh token một lần duy nhất cho mọi request đồng thời rồi chạy lại, lỗi trả về là `ApiError` có `message`, `statusCode`, `requestId`, `fieldErrors`.
6. **Mock** `mocks/handlers/projects.ts` trả đúng envelope `{ success, data }`. Thiếu handler cho endpoint mới thì `src/mocks/handlers.test.ts` đỏ.
7. **Bảng** `components/ui/data-table.tsx` nhận `list` từ hook: spinner chỉ hiện sau 200ms, `emptyState` bắt buộc, gợi ý cuộn ngang trên màn hẹp.
8. **Mutation** `hooks/use-project-mutations.ts`: `useMutation` với toast thành công/thất bại và `invalidateQueries(projectKeys.all)`. Page chỉ gọi `mutateAsync` và đóng modal khi xong.

Mọi feature mới đi đúng luồng này. `pnpm gen` sinh sẵn 12 file theo thứ tự đó.

## 5. Tầng `core/` và adapter `components/ui/`

### Vì sao tách

Các lỗi sau xuất hiện ở mọi dự án và không phụ thuộc thư viện UI: bấm nút hai lần tạo hai bản ghi, click ra ngoài modal khi đang gửi, `isPending` kẹt `true` khi query bị tắt, xoá dòng cuối trang để lại trang trống, response cũ về sau đè kết quả mới. Viết đúng một lần trong `core/`, rồi ép mọi feature đi qua đó.

### Có gì trong `core/`

| Hook / component                       | Lo việc gì                                                                                                  |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `core/hooks/use-async-action.ts`       | Bọc hành động async: đang chạy thì bỏ qua lần gọi sau, `pending` để bind loading, `isRunning()` đọc đồng bộ |
| `core/hooks/use-list-query.ts`         | List phân trang: `isLoading` đúng, `signal`, giữ data cũ, phát hiện trang tràn                              |
| `core/hooks/use-detail-query.ts`       | Detail: `isLoading` đúng cả khi `enabled: false`                                                            |
| `core/hooks/use-async-options.ts`      | Option cho select tìm server: debounce, huỷ request cũ, bỏ response cũ                                      |
| `core/hooks/use-debounced-callback.ts` | Debounce có dọn timer khi unmount                                                                           |
| `core/components/async-boundary.tsx`   | Chọn nhánh lỗi > loading > rỗng > data; bốn nhánh bắt buộc ở type                                           |
| `core/contracts.ts`                    | Type cho adapter: `AsyncAction`, `ConfirmFn`, `ListState`                                                   |

`core/` không import thư viện UI (ESLint chặn) và có coverage bắt buộc.

### Adapter trong `components/ui/`

Mỗi file một component, không có `index.ts` gom (barrel làm HMR chậm và tree-shaking kém). Feature bắt buộc dùng bản bọc cho các tên trong `WRAPPED_UI` ở `eslint.config.js`; import thẳng từ `antd` là lỗi lint.

| Adapter                           | Thêm gì so với Ant Design                                                                                         |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `components/ui/button.tsx`        | `onClick` trả Promise thì tự `loading`, bỏ qua click khi đang chạy                                                |
| `components/ui/modal.tsx`         | `submitting` khoá mask, ESC, nút X, nút huỷ; luôn `destroyOnHidden`; `onOk` trả Promise được                      |
| `components/ui/drawer.tsx`        | như Modal                                                                                                         |
| `components/ui/form.tsx`          | `onSubmit` trả Promise: chặn submit trùng, khoá field, gắn `ApiError.fieldErrors` vào đúng field                  |
| `components/ui/data-table.tsx`    | nhận `list` từ `useListQuery`, spinner trễ 200ms, `emptyState` bắt buộc, ScrollHint, sửa lỗi a11y của hàng đo cột |
| `components/ui/popconfirm.tsx`    | `okText`/`cancelText` bắt buộc, `danger`, chặn xác nhận trùng, chỉ đóng khi xong                                  |
| `components/ui/upload.tsx`        | whitelist MIME và cỡ file ở client, một file, giá trị là URL để đặt thẳng trong Form.Item                         |
| `components/ui/search-select.tsx` | select tìm server, `selectedOption` để có label khi sửa                                                           |
| `components/ui/use-confirm.ts`    | hộp thoại xác nhận trả `Promise<boolean>`, luôn có huỷ, `onConfirm` giữ loading tới khi xong                      |
| `components/ui/search-input.tsx`  | tìm sau khi ngừng gõ, Enter tìm ngay, xoá trắng trả `undefined`                                                   |

Các component Ant Design khác (`Card`, `Descriptions`, `Tag`, `Select` tĩnh, `Input`...) import thẳng như bình thường.

### Đổi thư viện UI

1. Viết lại từng file trong `components/ui/` với thư viện mới, giữ nguyên props.
2. Chạy `pnpm test` để bộ test hành vi `components/ui/*.test.tsx` xác nhận: bấm 3 lần chỉ chạy 1, mask không đóng khi gửi, spinner trễ, lỗi field hiện đúng chỗ.
3. Sửa `UI_LIBS` trong `eslint.config.js` để `core/` và `lib/` vẫn bị chặn với thư viện mới.
4. Các component không có hành vi (Card, Tag...) đổi tại chỗ trong feature.

## 6. Việc thường gặp: từng bước

### Thêm một feature CRUD

```bash
pnpm gen orders
pnpm exec vite build     # sinh lại routeTree.gen.ts
```

Sau đó:

1. Sửa `types.ts` cho khớp backend; cột trong `orders-table.tsx`; field trong `order-form-modal.tsx`.
2. Đổi nhãn tạm (`Orders`, `Tạo orders`...) sang tiếng Việt thật và cập nhật `src/locales/en.json`.
3. Thêm menu vào `src/app/layout/sidebar.tsx`. Cần phân quyền thì thêm `orders:read|create|update|delete` vào `features/auth/permissions.ts`, thêm `beforeLoad: () => requirePermission('orders:read')` vào route, bọc nút bằng `<Can>`.
4. `pnpm validate && pnpm test`.

### Thêm một endpoint

1. Khai trong `lib/endpoints.ts` theo nhóm.
2. Thêm method vào `interface <X>Api` rồi implement trong `features/<x>/api.ts`. Tên method: `list/detail/create/update/patch/remove`; hàng loạt là `<verb>Many`; list con là `list<Con>`.
3. Thêm handler MSW trong `mocks/handlers/<x>.ts` với `apiUrl`, `ok`, `fail`, `failFields`, `paginate` từ `mocks/utils.ts`.
4. Hook: query dùng `useListQuery`/`useDetailQuery`, mutation dùng `useMutation` với toast và `invalidateQueries`.

Thiếu bước 3 thì test đối chiếu endpoint↔handler đỏ.

### Thêm text hiển thị

Viết `t('Câu tiếng Việt có dấu')` rồi thêm cặp key/value vào `src/locales/en.json`. Test đối chiếu `src/app/i18n.test.ts` đỏ nếu thiếu. Nhãn trong map (`STATUS_LABELS`) cũng phải có trong `en.json` dù test tĩnh không bắt được.

### Thêm permission

Thêm chuỗi `<resource>:<action>` vào `PERMISSIONS`, gán cho role trong `ROLE_PERMISSIONS`, cập nhật `permissions.test.ts`. Dùng ở ba nơi: `requirePermission` trong route, `<Can>` quanh nút, `usePermissions().can()` khi cần biến boolean.

### Thêm màu hoặc token

Sửa `src/app/tokens.ts`, rồi theo thông báo của `src/app/tokens.test.ts` để cập nhật `:root` trong `src/styles/styles.css`. Không hex trong component, không `!important`.

### Thêm một hook hành vi dùng chung

Đặt ở `core/hooks/`, không import thư viện UI, viết test hành vi (không phải test render), thêm dòng vào `docs/skills/pitfalls.md`. Nếu là component Ant Design có hành vi dễ sai: bọc ở `components/ui/`, thêm tên vào `WRAPPED_UI`.

### Sửa một bug thật

Sửa xong phải để lại hai thứ: một guard (test hành vi, rule lint, hoặc test đối chiếu) và một dòng trong `docs/skills/pitfalls.md`. PR template có checkbox cho việc này. Không có guard thì người sau mắc lại.

## 7. Guard: máy đang chặn gì

| Guard                           | Chạy ở đâu                    | Bắt gì                                                                                                                                                                                                                                                                           |
| ------------------------------- | ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ESLint typed                    | pre-commit, validate, hook AI | tầng import sai, cross-feature, antd thẳng cho 7 component, `useQuery` thẳng, promise trong `onClick`, disable không lý do, component lồng, store không selector, secret trong `VITE_*`, text trần, a11y JSX, craft (`===`, không ternary lồng, complexity 12, file 400 dòng...) |
| TypeScript strict               | validate, build               | `noUncheckedIndexedAccess`, không `any`                                                                                                                                                                                                                                          |
| Prettier                        | pre-commit, validate          | format                                                                                                                                                                                                                                                                           |
| `scripts/check-structure.mjs`   | validate                      | folder lạ ở `src/`, file sai chỗ trong feature                                                                                                                                                                                                                                   |
| knip                            | validate                      | file, export, dependency không dùng                                                                                                                                                                                                                                              |
| `src/mocks/handlers.test.ts`    | test                          | endpoint thiếu handler MSW                                                                                                                                                                                                                                                       |
| `src/app/i18n.test.ts`          | test                          | key `t()` thiếu bản dịch                                                                                                                                                                                                                                                         |
| `src/app/tokens.test.ts`        | test                          | `tokens.ts` lệch `styles.css`                                                                                                                                                                                                                                                    |
| `src/test/pitfalls.test.ts`     | test                          | đường dẫn trong tài liệu không còn tồn tại                                                                                                                                                                                                                                       |
| test hành vi `core/`, `ui/`     | test                          | adapter hoặc hook core mất hành vi đã cam kết                                                                                                                                                                                                                                    |
| coverage                        | test:coverage, CI             | `lib/`, `core/`, `search/guards/permissions` dưới ngưỡng 95/90/95/95                                                                                                                                                                                                             |
| `scripts/check-bundle-size.mjs` | size, CI                      | mỗi route một chunk; framework 180 KB, entry 40 KB, chunk lẻ 250 KB, CSS 30 KB, tổng JS 750 KB (gzip)                                                                                                                                                                            |
| CI label `guards`               | CI                            | PR sửa `eslint.config.js`, `vitest.config.ts`, `vite.config.ts`, `tsconfig.json`, `scripts/`, `.github/` mà không gắn label                                                                                                                                                      |
| pnpm `minimumReleaseAge`        | install                       | package vừa publish dưới 24 giờ                                                                                                                                                                                                                                                  |
| Hook sau khi AI sửa file        | Claude Code, Cursor           | lint + format ngay file vừa sửa, trả lỗi về cho AI                                                                                                                                                                                                                               |

Nguyên tắc khi guard đỏ: sửa nguyên nhân. Không `eslint-disable`, không `@ts-ignore`, không hạ ngưỡng, không thêm exclude. Nếu thật sự cần ngoại lệ, ghi lý do ngay tại chỗ (`eslint-disable-next-line rule -- lý do`) và trong PR.

## 8. Auth, permission, route

- **Token** nằm trong `lib/auth-storage.ts` (localStorage). Store Zustand `features/auth/store.ts` chỉ giữ `user` và `isAuthenticated`. Đọc store qua selector.
- **Guard route** trong `beforeLoad` đọc `useAuthStore.getState()` để thấy giá trị mới nhất, không phụ thuộc React render. Chưa đăng nhập thì redirect về `/auth/login?redirectTo=...`; `redirectTo` chỉ nhận đường dẫn nội bộ (chặn open redirect, có test).
- **Phiên hết hạn**: refresh thất bại thì xoá token, về login với `reason=expired` và giữ `redirectTo`.
- **Permission** dạng `<resource>:<action>`. Frontend chỉ ẩn/hiện và chặn route; backend vẫn phải kiểm tra.
- **Route** theo convention TanStack: `_app` là layout cần đăng nhập, `$id` là param, `index.tsx` là trang list. Route chỉ khai báo; logic ở page. Loader dùng `ensureQueryData` với cùng `queryOptions` của hook để không nháy loading; API trả 404 thì `throw notFound()`.
- **Search param** của trang list và cả bảng con trên trang chi tiết đều qua `validateSearch`. Route có search bắt buộc thì khai input là `Partial` kèm `SearchSchemaInput` để `<Link>` không phải truyền đủ.

## 9. UI, token, i18n, mobile, a11y

- Token ở `src/app/tokens.ts` là nguồn duy nhất; `theme.ts` map sang Ant Design, `styles.css` khai lại ở `:root` cho Tailwind. Tailwind cho layout và spacing.
- Mọi màn có data xử lý đủ bốn nhánh: loading, lỗi có thử lại, rỗng có hướng dẫn, data. `QueryBoundary` và `DataTable` bắt buộc điều này ở type.
- Hành động phá huỷ đi qua `useConfirm` với `danger: true`; luôn có nút huỷ.
- Text: tiếng Việt có dấu là key, `en.json` là bản dịch. Ngày giờ qua `lib/format.ts`, không `dayjs().format` trong component.
- Mobile: desktop-first nhưng phải dùng được ở 375px. Dưới `lg` sidebar thành Drawer mở từ header; bảng cuộn trong khung riêng với gợi ý cuộn.
- A11y: icon-only button có `aria-label`; không tắt outline focus; trạng thái không chỉ truyền bằng màu. `e2e/a11y.spec.ts` quét axe WCAG 2.1 AA trên các trang chính.

## 10. Test

Ba tầng, mỗi tầng một việc:

| Tầng      | Công cụ                  | Đo gì                                                                    | Khi nào chạy                        |
| --------- | ------------------------ | ------------------------------------------------------------------------ | ----------------------------------- |
| Unit      | Vitest                   | `lib/`, `core/`, `search.ts`, `guards.ts`, `permissions.ts`; có ngưỡng   | mỗi lần `pnpm test`                 |
| Component | Vitest + Testing Library | adapter `components/ui/`, form của feature: hành vi, không phải snapshot | mỗi lần `pnpm test`                 |
| Đối chiếu | Vitest                   | endpoint↔MSW, `t()`↔`en.json`, tokens, đường dẫn trong docs              | mỗi lần `pnpm test`                 |
| E2E       | Playwright + axe         | luồng chính: auth, CRUD, thành viên, permission, mobile, i18n, a11y      | merge `main`, label `e2e`, hoặc tay |

Quy ước:

- Test nói hành vi bằng tiếng Việt: `it('bấm 3 lần khi đang chạy thì handler chỉ chạy 1 lần')`.
- Mock ở tầng network bằng MSW (`server.use` trong test), không mock module `http`.
- Không `expect(true)`. Test phải đỏ được khi hành vi mất.
- E2E dùng mock in-memory chung giữa các test chạy song song: assertion không dựa vào tổng số dòng hay thứ tự tuyệt đối, chỉ dựa vào dữ liệu test đó tạo ra.

## 11. Env, build, deploy, monitoring

- Env validate ở `lib/env.ts` bằng zod, thiếu là throw lúc khởi động. Hai biến: `VITE_API_BASE_URL`, `VITE_ENABLE_MOCK_API`. `VITE_*` bake vào bundle, không đặt secret; ESLint chặn tên gợi secret.
- `.env` commit cho production, `.env.development` cho `pnpm dev`, `.env.local` không commit.
- Build: `tsc --noEmit` rồi Vite 8 (rolldown). Framework (React, TanStack, Zustand, axios, i18next, zod, dayjs) tách một chunk để cache lâu. Mỗi route một chunk nhờ `autoCodeSplitting` của TanStack Router; `pnpm size` đọc `dist/.vite/manifest.json` và fail nếu route nào không được tách. Bản dịch tải động theo ngôn ngữ đang chọn, chunk đầu chỉ có bootstrap và layout.
- Docker đa tầng: build bằng Node 22, serve bằng nginx với SPA fallback, cache dài cho `/assets/`, proxy `/api/` sang `API_UPSTREAM` đổi được lúc chạy, security headers (CSP, nosniff, frame DENY) trong `deploy/security-headers.conf`, healthcheck `/healthz`.

```bash
docker build -t react-base --build-arg VITE_API_BASE_URL=/api .
docker run -p 8080:80 -e API_UPSTREAM=http://api:3000 react-base
```

- Monitoring và analytics là điểm cắm ở `src/app/monitoring.ts`; base không kéo SDK. Lỗi query, lỗi route, lỗi window và `X-Request-Id` của request lỗi đã tự đi qua `lib/monitoring.ts`. Lỗi nghiệp vụ 4xx không được report.

## 12. Khi gặp lỗi: đọc thông báo guard thế nào

Mỗi thông báo lỗi của base ghi rõ nên làm gì thay thế. Vài ví dụ hay gặp:

| Thông báo                                              | Nghĩa                                                      | Làm gì                                                                      |
| ------------------------------------------------------ | ---------------------------------------------------------- | --------------------------------------------------------------------------- |
| `'Button' import from 'antd' is restricted`            | feature đang lấy component có hành vi dễ sai từ antd thẳng | `import { Button } from '@/components/ui/button'`                           |
| `'useQuery' import ... is restricted`                  | query trong feature không đi qua core                      | `useListQuery` hoặc `useDetailQuery` từ `@/core/hooks`                      |
| `Promise-returning function provided to attribute`     | `onClick={async ...}` trên nút thường                      | dùng `Button` bọc, hoặc `useAsyncAction`                                    |
| `Unexpected undescribed directive comment`             | `eslint-disable` không ghi lý do                           | sửa nguyên nhân; nếu buộc phải disable, thêm `-- lý do`                     |
| `Feature không import feature khác`                    | import chéo giữa hai feature                               | đưa code chung xuống `components/` hoặc `lib/`                              |
| `Thiếu handler cho: /orders`                           | endpoint mới chưa có MSW                                   | thêm handler trong `mocks/handlers/`                                        |
| `Thiếu trong locales/en.json: ...`                     | key `t()` chưa có bản dịch                                 | thêm vào `en.json`                                                          |
| `src/foo: không thuộc cấu trúc`                        | folder mới ngoài danh sách                                 | đặt vào `features/<x>/`, `components/`, `core/` hoặc `lib/`                 |
| `Coverage for functions (94%) does not meet threshold` | thêm code vào `lib/` hoặc `core/` mà chưa test             | viết test hành vi, không hạ ngưỡng                                          |
| `FAIL totalJs ... KB`                                  | bundle vượt ngân sách                                      | `pnpm build:analyze` xem chunk nào phình; lazy route, bỏ import cả icon set |
| `X không tồn tại; sửa docs/skills/pitfalls.md`         | đổi tên file mà tài liệu còn trỏ tới tên cũ                | cập nhật docs cùng PR                                                       |

Danh sách đầy đủ lỗi hay gặp và thứ chặn từng lỗi: `docs/skills/pitfalls.md`. Lý do đằng sau các quyết định lớn: `docs/decisions.md`.
