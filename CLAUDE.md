# React Base

Trước khi tạo hoặc sửa bất kỳ thứ gì trong `src/`, đọc [SKILLS.md](./SKILLS.md) rồi chỉ đọc rule phụ liên quan trong `docs/skills/`.

## Bắt buộc

- Cấu trúc feature-first: `features/<x>/{types,api,search}.ts`, `hooks/`, `components/`, `pages/`. Mẫu chuẩn để copy: `src/features/projects`.
- Chiều phụ thuộc `routes → features → components → lib`. ESLint chặn vi phạm; không disable rule để né.
- Feature không import feature khác (trừ `features/auth`). Code chung đưa xuống `components` hoặc `lib`.
- File kebab-case. Export component PascalCase, hook `useX`.
- API: `lib/endpoints.ts` → `features/<x>/api.ts` → hooks TanStack Query. Không gọi `axios`/`http` trong component. Kèm handler MSW trong `mocks/handlers/`.
- Filter/pagination của list nằm trên URL qua `validateSearch` (zod `.catch`).
- Lỗi API là `ApiError`; UI lấy message qua `getErrorMessage`; không nuốt lỗi.
- UI text tiếng Việt có dấu, đi qua `t()` của react-i18next với key là chính câu tiếng Việt; thêm bản dịch vào `locales/en.json`. Ant Design chỉnh qua token trong `app/theme.ts`, không `!important`.
- Trước khi kết thúc: `yarn validate`, `yarn test`, `yarn build` phải pass. Nếu không chạy được, nói rõ lý do.

## Không làm

- Không thêm thư viện UI/state/router/toast khác khi chưa được yêu cầu.
- Không `any`, ép kiểu, `!`, `@ts-ignore` để né lỗi.
- Không `useEffect` để tính derived value, sync data từ Query, hay phản ứng user action.
- Không refactor ngoài phạm vi task.
