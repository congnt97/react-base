# Pitfalls: lỗi hay gặp và thứ trong base chặn nó

Đọc khi viết bất kỳ hành vi async, list, form, modal, xoá, upload, hoặc khi thêm thư viện UI mới. Mỗi dòng là một lỗi thật đã gặp, cái gì trong base chặn nó, và cách máy bắt. Không phụ thuộc thư viện UI: hành vi nằm ở `src/core/`, giao diện nằm ở adapter trong `src/components/ui/`. Đổi AntD sang thư viện khác thì viết adapter mới, chạy lại đúng bộ test hành vi trong `components/ui/*.test.tsx`.

## Máy đã ép

- Feature import `Button, Modal, Table, Popconfirm, Upload, Drawer` thẳng từ `antd`: ESLint chặn (`WRAPPED_UI` trong `eslint.config.js`). Dùng `components/ui/<tên>`.
- Feature import `useQuery` thẳng: ESLint chặn. Dùng `core/hooks/use-list-query.ts` hoặc `use-detail-query.ts`.
- `onClick={async …}` trên nút thường: ESLint `no-misused-promises` (attributes). Dùng `components/ui/button.tsx` hoặc `core/hooks/use-async-action.ts`.
- `core/` và `lib/` import thư viện UI: ESLint chặn.
- `eslint-disable` không ghi lý do, disable thừa, `@ts-ignore`: ESLint chặn.
- Hành vi của từng adapter và hook core: test trong `src/core/**/*.test.*` và `src/components/ui/*.test.tsx`, chạy cùng `pnpm test`.
- Đường dẫn nhắc trong file này phải tồn tại: `src/test/pitfalls.test.ts`.

Ký hiệu cột "Chặn": **máy** = lint/test đỏ; **core** = hook/adapter lo, chỉ cần dùng; **mẫu** = có ví dụ đúng để copy; **docs** = cần tự phán đoán.

## 1. Tải dữ liệu và bất đồng bộ

| #   | Lỗi                                      | Base chặn bằng                                                                                           | Chặn |
| --- | ---------------------------------------- | -------------------------------------------------------------------------------------------------------- | ---- |
| 1   | Loading mãi vì query `enabled: false`    | `useListQuery`/`useDetailQuery` trả `isLoading = isPending && isFetching`; feature không được `useQuery` | máy  |
| 2   | Loading mãi vì request treo              | `lib/http.ts` timeout 30s                                                                                | core |
| 3   | Loading không tắt khi lỗi                | `useAsyncAction` đặt `pending=false` trong `finally`; mutation dùng `isPending` của TanStack             | core |
| 4   | Click spam nút submit tạo 2 bản ghi      | `components/ui/button.tsx`: `onClick` trả Promise thì tự `loading` và bỏ qua click khi đang chạy         | máy  |
| 5   | Spam nút OK trong confirm                | `components/ui/use-confirm.ts`: `onConfirm` chạy trong `onOk` của AntD, nút khoá tới khi xong            | core |
| 6   | Click ra ngoài modal khi đang gửi        | `components/ui/modal.tsx`: `submitting` khoá mask, ESC, nút X, nút huỷ                                   | máy  |
| 7   | Response cũ về sau response mới          | `useListQuery`/`useDetailQuery` truyền `signal`; `api.ts` nhận `options.signal`                          | core |
| 8   | `setState` sau unmount                   | `react-hooks/*`; mẫu cleanup `core/hooks/use-debounced-callback.ts`                                      | máy  |
| 9   | Nuốt lỗi (`catch {}`, promise bỏ lửng)   | ESLint `no-empty`, `no-floating-promises`                                                                | máy  |
| 10  | Retry bão, refetch khi focus             | `lib/query-client.ts`: `retry: 1`, `refetchOnWindowFocus: false`                                         | core |
| 11  | Optimistic không rollback                | Mẫu 4 bước trong `features/projects/hooks/use-project-mutations.ts`                                      | mẫu  |
| 12  | Nhiều 401 cùng lúc gọi refresh nhiều lần | `lib/http.ts` single-flight, có test                                                                     | máy  |
| 13  | Refresh cũng 401 thành vòng lặp          | `lib/http.ts` không retry request refresh, có test                                                       | máy  |
| 14  | Spinner nháy khi response nhanh          | `components/ui/data-table.tsx`: `delay: 200`; router `defaultPendingMs: 200`                             | core |

## 2. Render và state

| #   | Lỗi                                        | Base chặn bằng                                                        | Chặn |
| --- | ------------------------------------------ | --------------------------------------------------------------------- | ---- |
| 15  | `useEffect` tính derived state, sync props | `react-hooks/no-deriving-state-in-effects`                            | máy  |
| 16  | Fetch trong `useEffect`                    | `axios` bị chặn ngoài `lib/http.ts`; `useQuery` bị chặn trong feature | máy  |
| 17  | Thiếu cleanup effect                       | `react-hooks/*`; mẫu `core/hooks/use-debounced-callback.ts`           | máy  |
| 18  | Dependency thiếu hoặc disable lint để né   | `exhaustive-deps` error; disable phải có lý do                        | máy  |
| 19  | `key` là index                             | `react/no-array-index-key`                                            | máy  |
| 20  | Thiếu `key` trong map                      | `react/jsx-key`                                                       | máy  |
| 21  | Component định nghĩa trong component       | Xem `docs/skills/hooks.md`                                            | docs |
| 22  | Mutate state, mutate data từ cache         | `react-hooks/immutability`                                            | máy  |
| 23  | Memo tay sai dependency                    | React Compiler rule                                                   | máy  |
| 24  | Lấy cả store Zustand                       | Xem `docs/skills/architecture.md`                                     | docs |
| 25  | Input đổi từ uncontrolled sang controlled  | Xem `docs/skills/ui.md`                                               | docs |
| 26  | Form giữ giá trị cũ khi mở lại modal       | `components/ui/modal.tsx` luôn `destroyOnHidden`                      | core |
| 27  | Hook gọi trong điều kiện hoặc vòng lặp     | `rules-of-hooks`                                                      | máy  |

## 3. Logic và dữ liệu

| #   | Lỗi                                     | Base chặn bằng                                                                                   | Chặn |
| --- | --------------------------------------- | ------------------------------------------------------------------------------------------------ | ---- |
| 28  | `\|\|` nhầm với `0`, `''`, `false`      | `prefer-nullish-coalescing`; xem `docs/skills/craft.md`                                          | máy  |
| 29  | `arr[0].x` khi mảng rỗng                | `noUncheckedIndexedAccess`                                                                       | máy  |
| 30  | `?.` che lỗi required                   | Xem `docs/skills/quality.md`                                                                     | docs |
| 31  | Xoá bản ghi cuối trang làm trang trống  | `useListQuery` phát hiện `items` rỗng, `total > 0`, `page > 1` và gọi `onPageOverflow(lastPage)` | core |
| 32  | Đổi filter không reset page             | Mẫu `features/projects/pages/projects-page.tsx`: filter đặt `page: 1`                            | mẫu  |
| 33  | Filter trong state, mất khi reload      | `validateSearch` trong route, xem `docs/skills/routing-auth.md`                                  | mẫu  |
| 34  | Query param sai làm vỡ route            | zod `.catch` trong `features/<x>/search.ts`                                                      | mẫu  |
| 35  | So sánh lỏng, so sánh object bằng `===` | `eqeqeq`                                                                                         | máy  |
| 36  | `switch` thiếu case khi thêm giá trị    | `switch-exhaustiveness-check`                                                                    | máy  |
| 37  | Ngày giờ lệch timezone                  | `lib/format.ts` chỉ nhận ISO đầy đủ                                                              | docs |
| 38  | Tiền dùng float                         | `lib/format.ts` chỉ hiển thị, không tính                                                         | docs |
| 39  | Ký tự có dấu trong URL, header          | `lib/url.ts` encode; test http dùng token ASCII                                                  | máy  |
| 40  | Sort mutate mảng gốc                    | `react-hooks/immutability`                                                                       | máy  |
| 41  | Điều kiện luôn đúng/sai                 | `no-unnecessary-condition`                                                                       | máy  |
| 42  | ID tạo bằng `Date.now()` trùng          | Chỉ trong mock, chấp nhận                                                                        | docs |

## 4. Auth và bảo mật

| #   | Lỗi                                    | Base chặn bằng                                            | Chặn |
| --- | -------------------------------------- | --------------------------------------------------------- | ---- |
| 43  | Token mất khi reload                   | `features/auth/store.ts` persist                          | mẫu  |
| 44  | Guard đọc context cũ nên bounce        | `features/auth/guards.ts` đọc `getState()`                | mẫu  |
| 45  | Redirect loop login và app             | `e2e/auth.spec.ts`                                        | mẫu  |
| 46  | Open redirect qua `redirectTo`         | `features/auth/search.ts` có test                         | máy  |
| 47  | Ẩn nút tưởng là an toàn                | Backend phải check; xem `docs/skills/routing-auth.md`     | docs |
| 48  | Phiên hết hạn đá về login im lặng      | `reason=expired` và giữ `redirectTo`                      | mẫu  |
| 49  | Log token, password                    | Xem `docs/skills/security.md`                             | docs |
| 50  | `dangerouslySetInnerHTML`, thiếu `rel` | ESLint                                                    | máy  |
| 51  | Secret trong `VITE_*`                  | Xem `docs/skills/env.md`                                  | docs |
| 52  | Upload không whitelist                 | `components/ui/upload.tsx` bắt buộc `accept`, `maxSizeMb` | core |
| 53  | Thiếu CSP, nosniff                     | `docker/nginx` headers                                    | máy  |
| 54  | Package độc hại vừa publish            | `pnpm-workspace.yaml` chặn 24h                            | máy  |

## 5. UI/UX

| #   | Lỗi                                        | Base chặn bằng                                                                                  | Chặn |
| --- | ------------------------------------------ | ----------------------------------------------------------------------------------------------- | ---- |
| 55  | Không có empty, error, retry               | `core/components/async-boundary.tsx` bắt buộc 4 nhánh ở type; `DataTable` bắt buộc `emptyState` | máy  |
| 56  | Không feedback sau hành động               | Toast trong hook mutation, mẫu `use-project-mutations.ts`                                       | mẫu  |
| 57  | Xoá không confirm, confirm không có Huỷ    | `use-confirm.ts` và `popconfirm.tsx` bắt buộc `cancelText`; `danger` cho phá huỷ                | máy  |
| 58  | Trang trắng khi một widget lỗi             | `components/feedback/route-error.tsx`                                                           | mẫu  |
| 59  | Mất điều hướng trên mobile                 | `app/layout/sidebar.tsx` Drawer dưới `lg`; `e2e/mobile.spec.ts`                                 | mẫu  |
| 60  | Bảng tràn ngang, không biết còn cột        | `DataTable` bọc sẵn `scroll-hint.tsx`                                                           | core |
| 61  | Text dài tràn khung                        | Xem `docs/skills/ui.md`                                                                         | docs |
| 62  | Tương phản thấp, icon không label          | `jsx-a11y/*`, `e2e/a11y.spec.ts`                                                                | máy  |
| 63  | Layout shift khi skeleton lệch kích thước  | Xem `docs/skills/ui.md`                                                                         | docs |
| 64  | Ô tìm kiếm phải bấm Enter mà không ai biết | `components/ui/search-input.tsx` debounce                                                       | core |
| 65  | Focus không quay lại sau đóng modal        | Adapter Modal/Drawer lo                                                                         | core |
| 66  | Toast trùng lặp                            | Chỉ toast ở hook, không ở page                                                                  | mẫu  |

## 6. Hiệu năng

| #   | Lỗi                               | Base chặn bằng                                 | Chặn |
| --- | --------------------------------- | ---------------------------------------------- | ---- |
| 67  | Bundle phình                      | `scripts/check-bundle-size.mjs` trong CI       | máy  |
| 68  | List lớn không phân trang         | `useListQuery` + `DataTable` phân trang server | core |
| 69  | Tính nặng trong render            | Xem `docs/skills/craft.md`                     | docs |
| 70  | Query key không ổn định           | Key factory trong `hooks/`, TanStack hash      | mẫu  |
| 71  | `staleTime: 0` với data tĩnh      | `lib/query-client.ts` 30s mặc định             | core |
| 72  | Memo tay khi đã có React Compiler | Compiler bật, rule chặn                        | máy  |

## 7. Thói quen AI

| #   | Lỗi                                             | Base chặn bằng                                                                                                         | Chặn |
| --- | ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ---- |
| 73  | Tạo helper trùng cái có sẵn                     | knip; `AGENTS.md` bước 2 tìm trước                                                                                     | máy  |
| 74  | Đoán tên field, tên hàm                         | typed lint                                                                                                             | máy  |
| 75  | Import sai tầng, tạo folder lạ                  | ESLint fence + `scripts/check-structure.mjs`                                                                           | máy  |
| 76  | Để `console.log`, TODO, code chết               | ESLint, knip                                                                                                           | máy  |
| 77  | `eslint-disable`, `ts-ignore`, hạ ngưỡng để qua | `eslint-comments/require-description`, `no-unused-disable`, `ban-ts-comment`; CI đòi label `guards` khi sửa file guard | máy  |
| 78  | Báo xong mà không chạy check                    | `AGENTS.md` "Định nghĩa xong"; hook `.claude/settings.json` lint ngay sau mỗi lần sửa file                             | máy  |
| 79  | Test giả `expect(true)`                         | Xem `docs/skills/testing.md`                                                                                           | docs |
| 80  | Quên mock, i18n cho thứ mới                     | `src/mocks/handlers.test.ts`, `src/app/i18n.test.ts`                                                                   | máy  |
| 81  | Đổi tên field không đồng bộ mock và backend     | Type dùng chung cho `api.ts` và handler; contract backend là việc của PR                                               | docs |
| 82  | Chỉ đúng trong mock                             | E2E chạy dev server thật; xem `docs/skills/testing.md`                                                                 | mẫu  |
| 83  | Sửa ngoài phạm vi                               | `AGENTS.md` "Không làm"                                                                                                | docs |

## Khi gặp lỗi mới

Một bug thật lọt lên production hoặc lọt qua review thì PR sửa bug phải để lại hai thứ: một guard (test hành vi trong `core/` hoặc `components/ui/`, rule ESLint, hoặc test đối chiếu) và một dòng trong file này. Sửa xong mà không để lại guard thì người sau, hoặc AI sau, sẽ mắc lại.
