# React Base Skill Router

Đọc file này trước khi làm bất kỳ feature, page, API, UI, auth/route, store, env, hoặc refactor nào trong `src/`. Sau đó chỉ đọc rule phụ liên quan.

## Stack Cố Định

React + TypeScript + Vite, Ant Design, Tailwind (layout/spacing), TanStack Router, TanStack Query, Zustand, Axios qua `lib/http.ts`, MSW cho mock, Vitest + Testing Library.

Không thêm Next.js, shadcn/ui, MUI, Redux, React Router, thư viện toast khác, CSS module, hoặc styling system mới khi chưa được yêu cầu rõ.

## Rule Loading Router

| Task chạm tới                                                          | Đọc                           |
| ---------------------------------------------------------------------- | ----------------------------- |
| Folder, feature mới, state, store, đặt tên                             | `docs/skills/architecture.md` |
| API, endpoint, query/mutation, cache, response/error, pagination, mock | `docs/skills/api.md`          |
| UI, layout, form, table, modal, Ant Design, Tailwind, màu, font, a11y  | `docs/skills/ui.md`           |
| Auth, token, route, guard, role, protected page, query param           | `docs/skills/routing-auth.md` |
| Env, config, base URL, secret                                          | `docs/skills/env.md`          |
| Security, permission, upload, XSS, logging                             | `docs/skills/security.md`     |
| useEffect, derived state, sync, subscription, custom hook              | `docs/skills/hooks.md`        |
| Type, generic, `any`, `!`, ép kiểu                                     | `docs/skills/typescript.md`   |
| Clean code, fallback, tách file, performance, error handling           | `docs/skills/quality.md`      |
| Test, mock trong test                                                  | `docs/skills/testing.md`      |

## Checklist Tối Thiểu

1. Search trước khi tạo mới: `rg` trong `src/components`, `src/features`, `src/lib`.
2. Feature có API đi đúng flow: `types -> lib/endpoints -> api.ts -> hooks -> components -> pages -> routes`, kèm handler MSW. Mẫu: `features/projects`.
3. State: local dùng `useState`; shared client state dùng Zustand; server state dùng TanStack Query. Không copy query data sang store.
4. Token không ở Zustand; guard đọc `useAuthStore.getState()`.
5. Env required, không fallback ngầm.
6. Không `useEffect` cho derived value, sync data, hay phản ứng user action.
7. Không `any`, ép kiểu, `!` để né lỗi.
8. Lỗi API là `ApiError`; UI lấy message qua `getErrorMessage`; không nuốt lỗi.
9. File dưới 400 dòng; mỗi component/hook một việc.
10. Trước khi kết thúc chạy `yarn check`, `yarn test`, `yarn build`.

## Prompt Gợi Ý

```text
Đọc SKILLS.md trước, sau đó làm feature ...
```
