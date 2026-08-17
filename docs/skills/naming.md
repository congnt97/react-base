# Naming Rules

Đọc file này khi task tạo/sửa file, component, hook, store, page, layout, route, DTO, repository, service.

## `UseCase`

Dùng PascalCase cho file component/container/class-like:

- `PageHeader.tsx`
- `AppButton.tsx`
- `SearchInput.tsx`
- `LoginForm.tsx`
- `ProjectsContainer.tsx`
- `AuthRepository.ts`
- `AuthRepositoryImpl.ts`
- `HttpClient.ts`
- `ResponseCommon.ts`
- `NetworkException.ts`
- `Project.ts`

## `useCase`

Dùng camelCase cho hook/store bắt đầu bằng `use`:

- `useLogin.tsx`
- `useLogout.tsx`
- `useMe.tsx`
- `useProjects.ts`
- `useAuthStore.ts`
- `useAppStore.ts`
- `useApi.ts`
- `useAxios.ts`

## `use-case`

Dùng kebab-case/lowercase cho page/layout/route style hiện tại:

- `overview-page.tsx`
- `presets-page.tsx`
- `auth-layout.tsx`
- `app-shell.tsx`
- `render-queue.tsx`
- `batch-studio.tsx`

Không trộn naming trong cùng một nhóm file.

## Page / Route / Container

- Route folder: `src/routes/_app/<route>/route.tsx`.
- Route file import `<FeaturePage>`, không import thẳng `<FeatureContainer>`.
- Page file: `src/presentation/features/<feature>/<feature>-page.tsx`.
- Page component: `export function FeaturePage() {}`.
- Container file giữ PascalCase: `containers/FeatureContainer.tsx`.

## Component Export

- Component/container public: `export function ComponentName() {}`.
- Hook public: `export function useFeature() {}`.
- Route file: `export const Route = createFileRoute(...)`.
