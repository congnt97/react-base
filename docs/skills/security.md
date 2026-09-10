# Security Rules

Đọc khi có token, permission, upload, secret, logging, render nội dung từ ngoài.

Frontend chỉ là guardrail. Backend phải enforce auth, permission, validate file và dữ liệu.

## Máy đã ép

- `dangerouslySetInnerHTML`: ESLint cảnh báo, phải sanitize trước.
- `target="_blank"` không `rel`: ESLint lỗi.
- `console.log`: ESLint. Log có kiểm soát dùng `console.warn/error` hoặc `monitoring`.
- CSP, nosniff, frame DENY, referrer policy: `deploy/security-headers.conf`, đã verify trên image.
- Package phát hành dưới 24 giờ hoặc chạy postinstall: pnpm chặn, khai báo trong `pnpm-workspace.yaml` kèm lý do.

## Token

- Source of truth ở `lib/auth-storage.ts`; store chỉ giữ `user`, `isAuthenticated`. Component không đọc token.
- Không log token, password, header Authorization, full auth response.
- Logout và phiên hết hạn phải clear storage, store, query cache. Đã có trong `use-logout.ts` và `app/router.tsx`.

## Permission

- Một cơ chế: `features/auth/permissions.ts`. Route dùng `requirePermission`, UI dùng `<Can>` hoặc `usePermissions`. Không check `role` trực tiếp trong component.
- Ẩn nút chỉ là UX; API vẫn phải từ chối khi không có quyền.

## Nội dung từ ngoài

- Text từ user, API, file upload là untrusted. React escape sẵn; chỉ nguy hiểm khi tự render HTML hoặc chèn vào URL, style, iframe.
- Upload dùng `components/ui/upload.tsx` với `accept` (MIME whitelist) và `maxSizeMb`. Không preview file HTML/SVG không kiểm soát.
- URL từ API phải validate trước khi mở hoặc nhúng. Mẫu chặn open redirect: `features/auth/search.ts`.

## Env và dependency

- `VITE_*` luôn bundle ra client, không đặt secret.
- Thêm package liên quan sanitize, auth, crypto phải nêu lý do trong PR; ưu tiên package phổ biến và còn maintain.
