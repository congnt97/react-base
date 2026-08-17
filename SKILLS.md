# AI Video Factory CMS Skill Router

Bắt buộc đọc file này trước khi làm bất kỳ feature, page, API flow, UI component, auth/route, store, repository, env/config, hoặc refactor nào trong `src/`.

Mục tiêu: AI tự phân loại task và chỉ đọc rule phụ liên quan, không đọc toàn bộ rule nếu không cần.

## Stack Cố Định

- ReactJS + TypeScript + Vite.
- Ant Design là UI component system chính.
- Tailwind CSS dùng cho layout utility và tinh chỉnh UI.
- TanStack Router dùng cho routing.
- TanStack Query dùng cho server state/API state.
- Zustand dùng cho client UI/auth state.
- Axios dùng qua `src/infrastructure/http/HttpClient.ts`.

Không dùng Next.js, shadcn/ui, Material UI, Chakra UI, Redux, React Router, CSS module mới, hoặc styling system mới khi chưa được yêu cầu rõ.

## Cách Đọc Rule Để Tiết Kiệm Token

1. Đọc file router này trước.
2. Tự phân loại task theo các trigger bên dưới.
3. Chỉ đọc file rule phụ liên quan.
4. Không đọc tất cả file trong `docs/skills` nếu task không cần.
5. Nếu task chạm nhiều nhóm, đọc nhiều file phụ tương ứng.

## Rule Loading Router

- Có tạo/sửa folder, model, repository, hook, container, page, route, store, state, hoặc feature mới:
  đọc `docs/skills/architecture.md`.
- Có đặt tên file, component, hook, store, page, layout, DTO, repository, service:
  đọc `docs/skills/naming.md`.
- Có UI, layout, form, table, modal, component, container, icon, image, thumbnail, width/height, Ant Design, Tailwind, màu sắc, font:
  đọc `docs/skills/ui.md`.
- Có API, endpoint, data fetching, mutation, TanStack Query, cache, repository impl, response/error:
  đọc `docs/skills/api.md`.
- Có env/config/base URL/secret/runtime variable:
  đọc `docs/skills/env.md`.
- Có auth, token, route, guard, login/logout/register, protected page, role:
  đọc `docs/skills/routing-auth.md`.
- Có security, permission, role, upload, file preview, token, secret, logging, XSS, AI/user/API output:
  đọc `docs/skills/security.md`.
- Có clean code, fallback/default value, mock data, tách file, performance, re-render, memo, table/list lớn, form lớn, function vs arrow, validation/build/test:
  đọc `docs/skills/quality.md`.

## Checklist Tối Thiểu Trước Khi Code

1. Search trước khi tạo mới: `rg`/`find` trong `src/presentation/components`, `src/presentation/features`, `src/presentation/hooks`, `src/domain/models`, `src/application/repositories`, `src/infrastructure/repositories`, `src/shared/endpoints.ts`, `src/routes`.
2. Reuse component/container/hook/model/repository nếu đã tồn tại.
3. Nếu common component chưa có, tạo trong `src/presentation/components` và wrap Ant Design.
4. Nếu có API, đi đúng flow: domain model -> application repository -> shared endpoint -> infrastructure repository impl -> presentation hook -> container/page.
5. Nếu có UI, check `src/styles/styles.css` và `src/presentation/provider/theme/antd-theme.ts`.
6. State rule nhanh: UI local dùng `useState/useReducer`; shared client state dùng Zustand; server/API state dùng TanStack Query.
7. Auth token không lưu chính trong Zustand; source of truth là `auth-storage` hoặc cookie.
8. Không dùng fallback giả/demo cho runtime data quan trọng; required data thiếu phải fail rõ hoặc hiện error state.
9. Nếu có env, env phải required, không optional/fallback ngầm.
10. Mỗi file không quá 500-600 dòng; gần 400 dòng thì cân nhắc tách.
11. Chạy `npm run check:type` và `npm run build` trước khi kết thúc; chạy `npm run test` nếu phù hợp.

## Prompt Gợi Ý Cho User

User chỉ cần nói:

```text
Đọc SKILLS.md trước, sau đó làm feature ...
```

AI phải tự đọc rule phụ liên quan theo router ở trên.
