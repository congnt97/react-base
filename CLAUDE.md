# React Base

Trước khi tạo hoặc sửa bất kỳ thứ gì trong `src/`, đọc [SKILLS.md](./SKILLS.md) rồi chỉ đọc rule phụ liên quan trong `docs/skills/`.

## Bắt buộc

- Cấu trúc feature-first: `features/<x>/{types,api,search}.ts`, `hooks/`, `components/`, `pages/`. Mẫu chuẩn: `src/features/projects`. Feature CRUD mới nên sinh bằng `pnpm gen <tên>` rồi sửa, thay vì viết tay từ đầu.
- Chiều phụ thuộc `routes → features → components → lib`. ESLint chặn vi phạm; không disable rule để né.
- Feature không import feature khác (trừ `features/auth`). Code chung đưa xuống `components` hoặc `lib`.
- Đặt tên theo `docs/skills/naming.md`: file kebab-case, component PascalCase, hook `useX`, hằng UPPER_SNAKE, boolean `is/has/can`, type không prefix `I`, API chỉ `list/detail/create/update/patch/remove`, không default export.
- API: `lib/endpoints.ts` → `features/<x>/api.ts` (khai báo `interface <X>Api` rồi `const xApi: XApi`) → hooks TanStack Query. Không gọi `axios`/`http` trong component. Kèm handler MSW trong `mocks/handlers/`.
- Filter/pagination của list nằm trên URL qua `validateSearch` (zod `.catch`).
- Lỗi API là `ApiError`; UI lấy message qua `getErrorMessage`; không nuốt lỗi.
- UI text tiếng Việt có dấu, đi qua `t()` của react-i18next với key là chính câu tiếng Việt; thêm bản dịch vào `locales/en.json`. Ant Design chỉnh qua token trong `app/theme.ts`, không `!important`.
- Trước khi kết thúc: `pnpm validate`, `pnpm test`, `pnpm build` phải pass. Nếu không chạy được, nói rõ lý do.

## Không làm

- Không thêm thư viện UI/state/router/toast khác khi chưa được yêu cầu.
- Không `any`, ép kiểu, `!`, `@ts-ignore` để né lỗi.
- Không `useEffect` để tính derived value, sync data từ Query, hay phản ứng user action.
- Không refactor ngoài phạm vi task.
