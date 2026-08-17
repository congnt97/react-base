# React Base

Base core frontend React được tách từ `ai-video-factory-cms`.

Đọc [SKILLS.md](./SKILLS.md) trước khi tạo hoặc sửa feature mới. File này là router rule chính cho kiến trúc, UI, API, auth, env, security và quality.

## Stack

- React + TypeScript + Vite
- Ant Design
- Tailwind CSS v4
- TanStack Router
- TanStack Query
- Zustand
- Axios qua `src/infrastructure/http/HttpClient.ts`

## Cấu Trúc Base

```text
src/
  application/      Contract ứng dụng: repository interface, DTO, exception, service interface
  di/               Provider gom dependency/repository để presentation dùng qua context
  domain/           Model/type thuần túy, không phụ thuộc UI/API framework
  infrastructure/   HTTP client, repository implementation, service implementation, API hooks
  mocks/            Mock data/dev-only repository, ví dụ mock auth
  presentation/     UI layer: component, feature page/container, hook, layout, provider, store
  routes/           TanStack Router file-based routes
  shared/           Constants, endpoints, enums, helper, validation, auth storage
  styles/           Global CSS, Tailwind import, design tokens
  test/             Test setup
```

## Luồng Khởi Tạo App

- `src/main.tsx` tạo router, query client, Ant Design provider, repository provider và render app.
- `src/routes/__root.tsx` khai báo root route, error boundary và chỉ load devtools trong development.
- `src/routes/_app/route.tsx` là protected app route, kiểm tra auth trước khi render `AppShell`.
- `src/routes/auth/*` là public auth routes.
- `src/presentation/layouts/app-shell.tsx` dựng layout CMS: sidebar, header, content.

## Auth Và Mock Login

Auth token không lưu làm source of truth trong Zustand. Token nằm ở `src/shared/auth-storage.ts`; Zustand chỉ giữ UI state như `user`, `isAuthenticated`, `isLoading`.

Mock auth mặc định tắt trong `.env` để tránh nhầm khi build production:

```env
VITE_ENABLE_MOCK_AUTH=false
```

Khi chạy `yarn dev`, `.env.development` bật mock auth cho local development:

```env
VITE_ENABLE_MOCK_AUTH=true
```

Tài khoản mock:

- Email: `admin@example.com`
- Mật khẩu: `123456`

Repository auth được chọn tại `src/infrastructure/repositories/createAuthRepository.ts`:

- Development + `VITE_ENABLE_MOCK_AUTH=true`: dùng `MockAuthRepositoryImpl`.
- Production hoặc `VITE_ENABLE_MOCK_AUTH=false`: dùng `AuthRepositoryImpl` để gọi API thật.

## API Flow

Khi thêm một module có API, đi theo flow:

```text
domain model
-> application repository interface
-> shared endpoint
-> infrastructure repository impl
-> presentation hook
-> container/page
-> route
```

Ví dụ auth hiện tại:

```text
src/domain/models/Auth.ts
src/application/repositories/AuthRepository.ts
src/shared/endpoints.ts
src/infrastructure/repositories/AuthRepositoryImpl.ts
src/presentation/hooks/auth/useLogin.tsx
src/presentation/features/auth/containers/LoginForm.tsx
src/routes/auth/login.tsx
```

Không gọi axios trực tiếp trong component/container/page. Gọi API qua repository và hook.

## Env

Env được validate tập trung ở `src/env.ts`.

```env
VITE_API_BASE_URL=/api
VITE_ENABLE_MOCK_AUTH=false
```

Không đọc `import.meta.env` rải rác trong feature/component. Thêm env mới thì khai báo required trong `src/env.ts` và cập nhật `.env.example`. Giá trị riêng cho dev local đặt trong `.env.development`.

## Thêm Feature Mới

1. Đọc `SKILLS.md`, sau đó đọc rule phụ liên quan trong `docs/skills`.
2. Search trước khi tạo mới để reuse component/hook/model có sẵn.
3. Nếu có API, tạo model -> repository interface -> endpoint -> repository impl -> hook.
4. Tạo container trong `src/presentation/features/<feature>/containers`.
5. Tạo page trong `src/presentation/features/<feature>/<feature>-page.tsx`.
6. Tạo route trong `src/routes/_app/<route>/route.tsx` nếu cần đăng nhập, hoặc `src/routes/auth/*` nếu public.

## Scripts

```bash
yarn install
yarn dev
yarn check:type
yarn check:lint
yarn test
yarn build
```

## Quy Ước UI

- UI text tiếng Việt phải có dấu đầy đủ.
- Dùng Ant Design trước, Tailwind cho layout/spacing.
- Reuse `PageHeader`, `SearchInput` khi phù hợp; button dùng Ant Design `Button` trực tiếp, chỉ tạo common khi có variant/behavior chung.
- Không lồng card nhiều lớp, không tạo palette mới nếu token hiện tại đáp ứng.
- Design tokens nằm trong `src/styles/styles.css` và `src/presentation/provider/theme/antd-theme.ts`.
