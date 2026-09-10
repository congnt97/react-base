# Skill Router

Rule chung và cách làm task nằm ở `AGENTS.md`. File này chỉ để chọn đúng rule phụ, đọc cái liên quan, không đọc hết.

## Stack cố định

React 19 + React Compiler, TypeScript, Vite, Ant Design, Tailwind (layout/spacing), TanStack Router, TanStack Query, Zustand, Axios qua `lib/http.ts`, MSW, Vitest + Testing Library, Playwright, pnpm.

## Đọc gì khi task chạm tới

| Task chạm tới                                                          | Đọc                           |
| ---------------------------------------------------------------------- | ----------------------------- |
| Folder, feature mới, state, store                                      | `docs/skills/architecture.md` |
| Đặt tên file, biến, type, hook, API, query key, event, branch, commit  | `docs/skills/naming.md`       |
| API, endpoint, query/mutation, cache, response/error, pagination, mock | `docs/skills/api.md`          |
| UI, layout, form, table, modal, Ant Design, Tailwind, màu, mobile      | `docs/skills/ui.md`           |
| Auth, token, route, guard, permission, query param                     | `docs/skills/routing-auth.md` |
| Env, config, base URL, secret                                          | `docs/skills/env.md`          |
| Security, upload, XSS, logging                                         | `docs/skills/security.md`     |
| useEffect, side effect, subscription, custom hook                      | `docs/skills/hooks.md`        |
| Type, generic, ép kiểu, response type                                  | `docs/skills/typescript.md`   |
| Fallback, tách file, performance, error handling, monitoring           | `docs/skills/quality.md`      |
| Test, mock trong test, coverage                                        | `docs/skills/testing.md`      |
| UI text, dịch, thêm ngôn ngữ, format ngày                              | `docs/skills/i18n.md`         |

Mỗi file rule mở đầu bằng khối "Máy đã ép": những gì ESLint/test đã bắt, không cần tự kiểm. Phần còn lại là rule cần phán đoán.
