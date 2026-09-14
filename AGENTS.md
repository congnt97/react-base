# Rule cho AI agent

Áp dụng cho Claude Code, Cursor, Codex, Copilot. `CLAUDE.md` import file này, không có rule riêng.

## Cách làm một task

1. Đọc `SKILLS.md`, chọn đúng file rule phụ theo bảng router. Không đọc tất cả. Riêng `docs/skills/craft.md` (logic đúng, code sạch, tối ưu, cú pháp) áp dụng cho mọi task viết code; `docs/skills/pitfalls.md` cho mọi task có async, list, form, modal, xoá.
2. Tìm cái có sẵn trước khi tạo mới: `rg` trong `src/components`, `src/features`, `src/lib`.
3. Feature CRUD mới: `pnpm gen <tên>` rồi sửa, không viết tay từ đầu. Mẫu để đối chiếu: `src/features/projects` (CRUD cơ bản), `src/features/members` (chọn nhiều, hàng loạt, drawer form, bảng con).
4. Sửa xong chạy `pnpm validate && pnpm test`. Đổi UI thì chạy thêm `pnpm test:e2e` (hoặc file spec liên quan) và xem thật trên browser.
5. Khi kết thúc, báo: đã làm gì, lệnh nào đã chạy và kết quả, còn gì chưa làm và vì sao.

## Định nghĩa "xong"

- `pnpm validate` sạch: type, lint (không warning), format, cấu trúc thư mục, code chết.
- `pnpm test` xanh, coverage không tụt dưới ngưỡng trong `vitest.config.ts`.
- Text mới có key trong `src/locales/en.json`; endpoint mới có MSW handler. Hai test đối chiếu sẽ đỏ nếu thiếu.
- Không còn chuỗi nhãn tạm từ `pnpm gen`.
- Không chạy được lệnh nào thì nói rõ, không tự cho là pass.

## Khi guard báo lỗi

Guard (ESLint, test đối chiếu, test hành vi core/adapter, check cấu trúc, knip, coverage, bundle size) tồn tại để bắt đúng loại lỗi hay gặp. Gặp lỗi thì sửa nguyên nhân. Không `eslint-disable`, không `@ts-ignore`, không hạ ngưỡng, không thêm exclude, trừ khi có lý do ghi rõ trong PR. Sửa file guard (`eslint.config.js`, `vitest.config.ts`, `vite.config.ts`, `tsconfig.json`, `scripts/`, `.github/`) thì PR phải gắn label `guards`; CI đỏ nếu thiếu.

Sửa một bug thật thì để lại guard chặn nó (test hành vi, rule lint, test đối chiếu) và một dòng trong `docs/skills/pitfalls.md`.

## Không làm

- Không thêm thư viện UI, state, router, toast, form, CSS mới khi chưa được yêu cầu rõ.
- Không tạo folder ngoài `app/ components/ core/ features/ lib/ locales/ mocks/ routes/ styles/ test/`.
- Không import feature từ feature khác (trừ `features/auth`). Code chung đưa xuống `components/` hoặc `lib/`.
- Không gọi `axios`/`http` trong component hay page. Đi qua `features/<x>/api.ts` rồi `useListQuery`/`useDetailQuery`/`useMutation`; không `useQuery` thẳng trong feature.
- Không import `Button, Modal, Table, Popconfirm, Upload, Drawer, Form` thẳng từ thư viện UI trong feature; dùng bản bọc `components/ui/<tên>`. Hành động async từ nút đi qua `Button` bọc hoặc `useAsyncAction`; select có dữ liệu từ API dùng `SearchSelect`.
- Không `useMemo`/`useCallback` tay (React Compiler lo), không `useEffect` để tính derived state hay sync data từ Query.
- Không hardcode text hiển thị; mọi chuỗi qua `t()` với key là câu tiếng Việt có dấu.
- Không `!important`, không hex màu trong component; token ở `src/app/tokens.ts`.
- Không refactor ngoài phạm vi task. Không xoá test để cho qua.

## Quy ước nhanh

- File kebab-case; component PascalCase; hook `useX`; hằng UPPER_SNAKE; type không prefix `I`.
- Tập giá trị đóng (trạng thái, vai trò, quyền, ngôn ngữ) khai bằng `enum` và gọi qua tên: `ProjectStatus.ACTIVE`, không viết `'active'`.
- API method chỉ `list/detail/create/update/patch/remove`; `interface <X>Api` khai báo trước implementation.
- Quyền chỉ qua `can()`, `<Can>`, `requirePermission`. `AuthUser` không có `role`; không thêm lại.
- Filter và pagination của list nằm trên URL qua `validateSearch` (zod `.catch`).
- Lỗi API là `ApiError`; UI hiện qua `getErrorMessage`; không nuốt lỗi.
- Commit: tiếng Việt, động từ đầu câu, dưới 72 ký tự.
