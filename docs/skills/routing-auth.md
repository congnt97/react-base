# Routing And Auth Rules

Đọc file này khi task có auth, route, guard, login/logout/register, protected page, role.

## Auth Flow Hiện Tại

- Store: `src/presentation/stores/useAuthStore.ts`.
- Session expiry: `src/main.tsx` đăng ký `subscribeSessionExpired` (HttpClient gọi `notifySessionExpired` khi refresh token thất bại) để `clearAuth` và đưa về `/auth/login`.
- Storage: `src/shared/auth-storage.ts`.
- Public routes: `src/routes/auth/*`.
- Protected routes: `src/routes/_app/*`.
- Guard + hydrate user: `src/routes/_app/route.tsx` (`beforeLoad` gọi `/me` qua `context.repositories`, hydrate user vào Zustand).
- Role guard helper: `src/shared/route-guards.ts` (`hasRole`).

## Auth Token Rules

Auth token không được lưu làm source of truth trong Zustand.

Source of truth:

- Token: `src/shared/auth-storage.ts` hoặc httpOnly cookie nếu backend hỗ trợ.
- Zustand: chỉ giữ UI auth state như `user`, `isAuthenticated`, `isLoading`, và actions `setAuthenticated`, `clearAuth`.
- HttpClient: đọc token từ `auth-storage` hoặc gửi cookie credential, không đọc token từ component.
- Hydrate user: `_app/route.tsx` `beforeLoad` validate token qua `/me` và hydrate user vào Zustand; session hết hạn giữa phiên do listener trong `main.tsx` xử lý.
- Logout: clear cả `auth-storage` và Zustand; clear query client nếu cần.

Lý do:

- Zustand mất state khi refresh page.
- Token cần dùng ở HttpClient interceptor.
- Giảm nguy cơ log/expose token trong store/devtools.
- Persistence auth nằm một chỗ rõ ràng.

Nếu backend support httpOnly cookie:

- Frontend không đọc access token trực tiếp.
- HttpClient gửi request với credential config.
- Zustand vẫn chỉ giữ `user/isAuthenticated/isLoading`.

## Route Rules

- Route file chỉ nên import page và khai báo `createFileRoute`.
- Ưu tiên folder route của TanStack Router: `src/routes/_app/<route>/route.tsx`.
- Route không import thẳng container, trừ khi đó là route đặc biệt chưa có page.
- Guard auth đặt trong `_app/route.tsx`.
- Route không chứa UI phức tạp.
- Đặt route trong `_app` nếu cần đăng nhập.
- Không tự viết guard riêng trong từng page nếu `_app` đã bảo vệ đủ.
- Nếu cần role guard, tạo helper trong `src/shared/route-guards.ts` trước, rồi dùng trong route.

## Tạo Page Mới

1. Tạo model/type nếu cần.
2. Tạo repository + hook nếu page có data.
3. Tạo/reuse common components.
4. Tạo container trong `src/presentation/features/<feature>/containers/<FeatureContainer>.tsx`.
5. Tạo feature page lowercase: `src/presentation/features/<feature>/<feature>-page.tsx`.
6. Tạo route file trong `src/routes/_app/<route>/route.tsx` hoặc `src/routes/auth/<route>.tsx`.

Route file nên ngắn:

```tsx
import { createFileRoute } from '@tanstack/react-router';
import { FeaturePage } from '@/presentation/features/feature/feature-page';

export const Route = createFileRoute('/_app/feature')({
  component: FeaturePage,
});
```

Page file compose container:

```tsx
import { FeatureContainer } from '@/presentation/features/feature/containers/FeatureContainer';

export function FeaturePage() {
  return <FeatureContainer />;
}
```
