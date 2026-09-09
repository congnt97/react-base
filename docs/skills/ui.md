# UI Rules

Đọc file này khi task có UI, layout, form, table, modal, component, container, Ant Design, Tailwind, màu sắc, font.

## Bắt Buộc Check

Trước khi làm UI, đọc nhanh:

- `src/styles/styles.css`
- `src/app/theme.ts`

Chỉnh Ant Design qua token trong `app/theme.ts` (`token`, `components.<Tên>`), không override CSS bằng `!important`.

## Design Tokens

Nguồn duy nhất: `src/app/tokens.ts`. `app/theme.ts` map sang tên của AntD; `styles/styles.css` khai báo lại cùng giá trị ở `:root` cho Tailwind (AntD scope biến của nó vào class hash nên không dùng chung được). `src/app/tokens.test.ts` fail nếu hai nơi lệch, nên đổi màu thì sửa `tokens.ts` rồi cập nhật `styles.css` theo thông báo test.

- Font family: Inter.
- App background: `#f8fafc`.
- Sidebar background: `#0f172a`.
- Sidebar active: `#1d4ed8`.
- Content background: `#ffffff`.
- Primary: `#2563eb`.
- Text main: `#0f172a`.
- Text muted: `#64748b`.
- Border: `#e2e8f0`.
- Border strong: `#cbd5e1`.
- Link: `#1d4ed8`.
- Success: `#166534` trên nền `#dcfce7`.
- Warning: `#92400e` trên nền `#fef3c7`.
- Danger: `#dc2626` trên nền `#fee2e2`.
- Placeholder, text phụ (tertiary/description): `#64748b`. Các màu chữ này đã chọn để đạt WCAG AA trên nền trắng; đổi nhạt hơn sẽ fail `e2e/a11y.spec.ts`.
- Border radius mặc định: 8px.
- Header height: 64px.
- Sidebar width: 260px.

## Component Rules

Trước khi tạo component/container mới:

1. Search component tồn tại:
   `rg -n "Input|Button|Table|PageHeader|Modal|Upload|Select|Tabs" src/components src/features`
2. Nếu có common component phù hợp, reuse.
3. Nếu chưa có, tạo common component trong `src/components` (`layout/`, `ui/`, `feedback/`).
4. Common component phải wrap Ant Design, không viết lại từ `div` nếu AntD đã có.
5. Container chỉ orchestration UI của feature, không viết helper lớn trong cùng file.
6. Page chỉ compose layout/container, không chứa form/table logic dài.
7. Route chỉ import Page component; không import thẳng Container nếu page đã tồn tại.

Ví dụ:

- Input mới: tạo/mở rộng `src/components/ui/*` dựa trên Ant Design `Input` (mẫu: `search-input.tsx`).
- Button: dùng Ant Design `Button` trực tiếp; chỉ tạo common button khi có variant/behavior chung.
- Page header: reuse `components/layout/page-header.tsx`.
- Loading/lỗi/404/403: reuse `components/feedback/*` (`PageLoading`, `ErrorState`, `NotFound`, `RouteError`).
- Danh sách rỗng: `EmptyState` với title, mô tả và nút hành động (khác thông điệp khi rỗng do filter và rỗng thật). Không để "Trống" mặc định của AntD.
- Ngày, số, tiền, kích thước file: `lib/format.ts` (`formatDate`, `formatDateTime`, `formatRelativeTime`, `formatNumber`, `formatCurrency`, `formatFileSize`). Không gọi `dayjs().format` hay `toLocaleString` trong component.

## Common Component Extraction Rules

Không phải cứ gặp Ant Design component là bọc ra common. Chỉ đưa ra common khi component đó có giá trị tái sử dụng, design-system behavior, hoặc custom logic rõ ràng.

Nên đưa ra `src/components` khi:

- Custom style/token giống nhau ở nhiều nơi.
- Có behavior chung: debounce search, clearable input, confirm delete, upload validation, table action menu.
- Có format chung: breadcrumb, status chip, page header, empty state, filter select.
- Có accessibility/UX chung cần giữ nhất quán.
- Dùng từ 2 nơi trở lên, hoặc chắc chắn là pattern toàn app.
- Có security/permission behavior chung: permission gate, safe preview, confirm destructive action.

Ví dụ nên common:

- `PageHeader`
- `AppBreadcrumb`
- `SearchInput`
- `StatusTag`
- `ConfirmDeleteModal`
- `TableActionDropdown`
- `AppEmptyState`
- `AppUpload`
- `FilterSelect`
- `PermissionGate`

Không nên đưa ra common khi:

- Chỉ dùng 1 lần và không có custom đáng kể.
- Chỉ bọc AntD mà không thêm giá trị.
- Component quá đặc thù domain của 1 feature.
- Common làm prop API phình to, khó dùng hơn AntD gốc.

Không làm:

```tsx
export function AppCheckbox(props) {
  return <Checkbox {...props} />;
}
```

Nếu page đang vẽ UI:

1. Check `src/components` trước.
2. Nếu common có rồi thì reuse.
3. Nếu chưa có và chỉ là AntD bình thường, dùng AntD trực tiếp.
4. Nếu phải custom AntD theo style/behavior chung, tạo common component.
5. Nếu custom chỉ phục vụ feature đó, đặt trong feature/container, không đưa lên common.

Rule ngắn:

```text
First use: build local inside feature/container.
Second use or clear design-system pattern: extract to common.
Shared behavior/security/accessibility: extract immediately.
```

## Visual Rules

- Dùng Ant Design components trước: `Button`, `Input`, `Form`, `Table`, `Card`, `Tag`, `Modal`, `Select`, `Upload`, `Tabs`, `Progress`.
- Dùng Tailwind cho layout/spacing nhẹ.
- Không tạo palette mới nếu token hiện tại đáp ứng.
- Không dùng gradient tím, neon, glassmorphism, shadow nặng.
- Không dùng font khác Inter.
- Không scale font theo viewport width.
- Text UI tiếng Việt phải có dấu đầy đủ, rõ nghĩa và nhất quán.
- Table/form/dashboard phải gọn, rõ, desktop-first.
- Không lồng card nhiều lớp.
- Đảm bảo text không tràn khỏi button/card ở desktop và mobile.

## Layout Sizing Rules

Hard code được khi kích thước là design token hoặc fixed-format control. Không hard code tùy tiện cho layout/content lớn.

Được hard code:

- Sidebar width: `260px`.
- Header height: `64px`.
- Icon button: `32px` hoặc `40px`.
- Avatar: `40px`.
- Status chip height: `24px`.
- Progress bar height: `8px`.
- Table action button/icon size.
- Toolbar height.
- Logo/icon fixed size.
- Thumbnail/video frame dùng fixed aspect ratio.

Không nên hard code:

- Page content width bằng px cứng mà không có responsive constraint.
- Card/list/table height cố định khi nội dung có thể dài.
- Form width quá rộng/quá hẹp mà không có `max-w`/`w-full`.
- Image width/height làm méo ảnh.
- Grid column width cứng cho mọi viewport.
- Text container height cố định nếu không xử lý overflow.

Nên dùng:

- `max-w-*`, `w-full`, `min-w-0`.
- `flex`, `grid`, responsive columns.
- `aspect-video`, `aspect-square` cho image/video/thumbnail.
- `object-cover` cho thumbnail, `object-contain` khi cần thấy toàn bộ ảnh.
- `overflow-auto` cho table/content dài.
- `truncate`, `line-clamp`, hoặc wrap text có chủ đích.

## Page Layout Pattern

CMS page nên theo pattern:

```text
AppShell
  Sidebar fixed 260px
  MainLayout
    Header fixed 64px
    Content padding 24px
      PageHeader
      Sections gap 24px
      Cards/tables/forms
```

Rule page:

- Không làm landing page cho màn hình CMS.
- Desktop-first nhưng không vỡ mobile.
- Content nên `max-w-[1440px]`, `mx-auto`, `p-6`.
- Section dùng `gap-6` hoặc spacing theo token.
- Card radius 8px, border nhẹ, shadow nhẹ hoặc không shadow.
- Table/list dùng `w-full`, có horizontal scroll nếu cần.
- Form ít field nên có `max-w`, không stretch tràn màn hình.
- Preview/video dùng `aspect-video`.
- Image thumbnail dùng `aspect-video` hoặc `aspect-square`.

Rule ngắn:

```text
Hard code design tokens and fixed controls.
Use responsive constraints for layout/content.
Use aspect-ratio for images/video/thumbnail.
Never fixed-height text containers unless overflow is handled.
```

## Form Handling Rules

### Dùng validation của Ant Design Form, không tự viết tay

Không làm — tự quản state lỗi bằng `useState`:

```tsx
const [emailError, setEmailError] = useState('');
```

Nên làm — dùng `rules` của `Form.Item` (xem `features/auth/components/login-form.tsx` và `features/projects/components/project-form-modal.tsx` làm mẫu).

### Submit phải có loading state và disable khi đang gửi

Không làm — nút submit vẫn bấm được nhiều lần trong lúc request đang chạy:

```tsx
<Button htmlType="submit">Lưu</Button>
```

Nên làm — bind `loading`/`disabled` theo trạng thái mutation:

```tsx
<Button htmlType="submit" loading={mutation.isPending}>
  Lưu
</Button>
```

### Reset form đúng cách

Dùng `form.resetFields()` của AntD `Form` instance, không tự set từng field bằng state tay.

### Không watch toàn bộ form nếu chỉ cần 1-2 field

Không làm — watch cả object gây re-render toàn form mỗi lần gõ:

```tsx
const values = Form.useWatch([], form);
```

Nên làm — watch đúng field cần:

```tsx
const status = Form.useWatch('status', form);
```

### Không tin validate frontend là đủ

Validate frontend chỉ để UX tốt hơn; lỗi trả về từ backend vẫn phải hiển thị lại trên đúng field hoặc form-level error, không giả định request luôn thành công vì đã validate FE.

## Accessibility Cơ Bản

Hai lớp kiểm tra tự động, không bỏ qua bằng cách disable rule:

- `eslint-plugin-jsx-a11y` (recommended) chạy trong `pnpm validate`: thiếu `alt`, label, role sai, click không có keyboard event.
- `e2e/a11y.spec.ts` quét axe WCAG 2.1 AA trên mọi trang chính; thêm trang mới thì thêm test. Helper `expectNoA11yViolations(page)`; `disableRules` chỉ khi có lý do ghi trong test.

Ant Design đã xử lý phần lớn a11y (focus trap trong Modal/Drawer, keyboard nav trong Menu/Select). Vẫn cần tự đảm bảo:

- Icon-only button (không có text) phải có `title`/`aria-label`, không để screen reader đọc trống.
- Ảnh có nghĩa (không phải decorative) phải có `alt` mô tả; ảnh trang trí thuần túy để `alt=""`.
- Không disable outline focus (`outline: none`) mà không thay bằng style focus khác rõ ràng.
- Modal/Drawer xác nhận hành động phá hủy (xoá, logout) phải có nút Huỷ rõ ràng, không chỉ dựa vào click ra ngoài.
- Không dùng màu là cách duy nhất truyền đạt trạng thái (status chỉ có màu, không có text/icon đi kèm).
