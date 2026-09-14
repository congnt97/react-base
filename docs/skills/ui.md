# UI Rules

Đọc khi có UI, layout, form, table, modal, Ant Design, Tailwind, màu, mobile.

## Máy đã ép

- Text trần trong JSX và `placeholder/title/aria-label/alt`: ESLint `i18next/no-literal-string`.
- Thiếu `key`, `alt`, label, role sai, click không có keyboard: ESLint `react/*`, `jsx-a11y/*`.
- CSS biến lệch với `design-tokens.json`: `src/app/tokens.test.ts`.
- Tương phản màu, a11y WCAG 2.1 AA trên mọi trang chính, cả ở 375px: `e2e/a11y.spec.ts`, `e2e/mobile.spec.ts`.
- Feature import `Button, Modal, Table, Popconfirm, Upload, Drawer, Form` thẳng từ `antd`: ESLint chặn, dùng bản bọc trong `components/ui/`. Các component AntD khác import thẳng.
- Component khai báo bên trong component: ESLint `react/no-unstable-nested-components`.
- `onClick={async …}` trên nút thường: ESLint chặn. Dùng `components/ui/button.tsx`.

## Token và style

- Màu, radius, kích thước layout: `src/app/design-tokens.json` là nguồn duy nhất. `theme.ts` map sang AntD, `scripts/generate-token-css.mjs` sinh `styles/tokens.generated.css` cho Tailwind. Sửa JSON rồi chạy `pnpm tokens:css`; `pnpm dev` tự sinh lại.
- Chỉnh AntD qua `theme.ts` (`token`, `components.<Tên>`), không override CSS, không `!important`. Ngoại lệ duy nhất đã ghi trong code: `text-white!` cho brand trên nền tối vì `.ant-app a` tô màu link.
- Tailwind cho layout và spacing. Không hex trong component; dùng `var(--text-muted)` hoặc token.

## Component dùng chung

Có sẵn, reuse trước khi tạo mới:

| Cần                          | Dùng                                                                                                      |
| ---------------------------- | --------------------------------------------------------------------------------------------------------- |
| Nút có hành động async       | `components/ui/button.tsx`: `onClick` trả Promise thì tự loading, chặn click spam                         |
| Modal form                   | `components/ui/modal.tsx`: `submitting` khoá mask/ESC/X, luôn `destroyOnHidden`                           |
| Xác nhận xoá, hành động nguy | `components/ui/use-confirm.ts` (hộp thoại) hoặc `components/ui/popconfirm.tsx`                            |
| Bảng list                    | `components/ui/data-table.tsx` nhận `list` từ `useListQuery`, `emptyState` bắt buộc                       |
| Drawer                       | `components/ui/drawer.tsx`: `submitting` khoá đóng                                                        |
| Form                         | `components/ui/form.tsx`: `onSubmit` trả Promise, chặn submit trùng, khoá field, gắn lỗi field từ backend |
| Select tìm từ server         | `components/ui/search-select.tsx`: debounce, huỷ request cũ, `selectedOption` khi sửa                     |
| Upload một file              | `components/ui/upload.tsx`, whitelist MIME + size                                                         |
| Loading/lỗi/rỗng cho query   | `components/feedback/query-boundary.tsx`, 4 nhánh bắt buộc                                                |
| Tiêu đề trang, breadcrumb    | `components/layout/page-header.tsx`                                                                       |
| Ô tìm kiếm                   | `components/ui/search-input.tsx`, có debounce, `onSearch`                                                 |
| Rỗng                         | `components/feedback/empty-state.tsx`, có nút hành động                                                   |
| Loading, lỗi, 404, 403       | `components/feedback/*`                                                                                   |
| Ngày, số, tiền, file size    | `lib/format.ts`, không `dayjs().format` trong component                                                   |

Adapter trong `components/ui/` là chỗ duy nhất biết thư viện UI cho các hành vi dễ sai. Hành vi (khoá click, khoá modal, loading trễ, trang tràn) nằm ở `src/core/`, không phụ thuộc AntD; đổi thư viện UI thì viết adapter mới và chạy lại test `components/ui/*.test.tsx`. Danh sách lỗi và thứ chặn: `docs/skills/pitfalls.md`.

Tạo component chung mới chỉ khi: dùng từ 2 nơi, hoặc có behavior/a11y chung cần nhất quán. Chỉ bọc AntD mà không thêm gì thì không tạo. Component đặc thù một feature đặt trong `features/<x>/components`.

## Layout

- Page: `PageHeader` rồi các section `gap-6`, nội dung `max-w-[1440px] mx-auto p-6`. Đã có sẵn trong `AppShell`.
- Hard-code được: sidebar 260, header 64, icon button 32/40, avatar, aspect ratio. Không hard-code: chiều rộng nội dung, chiều cao card/list/table có nội dung dài.
- Text dài: `truncate`, `line-clamp`, hoặc wrap có chủ đích. Không container chiều cao cố định mà không xử lý overflow.
- Ảnh và video: `aspect-video`/`aspect-square`, `object-cover`.

## Form

- Validate bằng `rules` của `Form.Item`, không tự quản state lỗi. Mẫu modal: `features/projects/components/project-form-modal.tsx`; mẫu drawer có select tìm server: `features/members/components/member-form-drawer.tsx`.
- `onSubmit` trả Promise của `mutateAsync`; lỗi field từ backend tự hiện dưới field, lỗi khác đã toast ở hook mutation.
- Nút submit trong `<Form>` bind `loading={mutation.isPending}`; nút gọi hành động async trực tiếp thì để `Button` bọc tự lo.
- Modal form truyền `submitting={mutation.isPending}` cho `Modal` bọc; không tự xử lý `maskClosable`/`destroyOnHidden`.
- `Form.useWatch('field', form)` đúng field cần, không watch cả form.
- Lỗi backend trả về vẫn phải hiện lại, không giả định validate FE là đủ. Backend trả `errors: { field: message }` là `Form` bọc tự gắn.

## Trạng thái hiển thị

Mỗi màn hình có data phải xử lý đủ 4 nhánh: loading, lỗi (`ErrorState` có retry), rỗng (`EmptyState`, phân biệt rỗng do filter và rỗng thật), có data. `QueryBoundary` và `DataTable` bắt buộc ở type nên không quên được. Hành động phá huỷ (xoá, logout) đi qua `useConfirm` với `danger: true`.

## Mobile

Desktop-first nhưng phải dùng được ở 375px:

- Dưới `lg`, sidebar thành Drawer mở từ nút trong header; chọn xong tự đóng. Màn hình mới không được là lối điều hướng duy nhất.
- Trang không tràn ngang; bảng cuộn trong khung riêng với `ScrollHint`.
- Màn hình mới thêm vào `e2e/mobile.spec.ts`.

## A11y ngoài những gì máy bắt

- Icon-only button có `aria-label`.
- Không tắt outline focus mà không thay style focus khác.
- Trạng thái không chỉ truyền bằng màu; có text hoặc icon đi kèm.
