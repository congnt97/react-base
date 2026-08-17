# Quality Rules

Đọc file này khi task liên quan clean code, tách file, performance, function vs arrow, validation/build/test.

## File Size

- Mỗi file không được quá 500-600 dòng.
- Nếu file gần 400 dòng, cần cân nhắc tách:
  - constants/mock data
  - sub component
  - hook
  - table columns
  - form schema/validation
  - utility function
- Không đặt nhiều component lớn trong cùng một file.
- Không viết logic API, transform data lớn, validation lớn trực tiếp trong JSX.
- Không thêm comment nếu code tự giải thích được.
- Không refactor ngoài phạm vi feature.

## Runtime Fallback Rules

Không dùng fallback giả/demo cho runtime data quan trọng.

Không làm:

```ts
label: user?.email || 'admin@aivideofactory.local';
title: project?.name || 'Demo Project';
count: response?.total || 0;
```

Lý do: fallback giả che lỗi production, làm UI trông có vẻ đúng trong khi data required đang thiếu.

Rule:

- Required data thiếu thì fail rõ, hiện error state, skeleton/error boundary, redirect, logout, hoặc throw error theo flow.
- Optional data thiếu thì hiện empty state trung thực: `Chưa có email`, `Chưa cập nhật`, `Không có dữ liệu`.
- Mock/default demo chỉ được nằm trong mock/dev layer: `src/mocks`, fake repository dev-only, story/test.
- Không đặt email, tên user, tên project, token, URL, ID demo trong component production.
- Không dùng `||` cho fallback nếu giá trị hợp lệ có thể là `0`, `''`, hoặc `false`; cân nhắc `??` cho optional display.
- Với data từ API required, ưu tiên validate/normalize ở hook hoặc repository boundary trước khi render.

Chấp nhận được:

```ts
label: user?.email ?? 'Chưa có email';
```

Tốt hơn nếu user là required:

```ts
if (!user) {
  return <ErrorState message="Không tải được thông tin user" />;
}
```

## Function vs Arrow Function

Không chọn `function` hay arrow function vì performance trừ khi có benchmark rõ ràng. Khác biệt hiệu năng thường rất nhỏ; ưu tiên ý nghĩa và consistency.

Dùng `function` cho export public và đơn vị code độc lập:

- React component: `export function LoginForm() {}`
- Custom hook: `export function useLogin() {}`
- Helper shared: `export function buildUrl() {}`
- Route component nội bộ nếu cần tách riêng.
- Function cần hoist hoặc cần name rõ trong stack trace.

Dùng arrow function cho callback/handler ngắn:

- Event handler trong component: `const handleSubmit = async () => {}`
- Callback của `map`, `filter`, `render`, `onClick`, `onFinish`.
- Table column render: `render: (status) => <Tag>{status}</Tag>`.
- Config/object literal callback ngắn cần closure.

Không tạo component mới bên trong component cha. Nếu JSX/block lớn, tách thành component riêng bằng `function`.

Performance React ưu tiên:

- Tách component lớn.
- Tránh object/array/function lớn tạo lại trong render nếu truyền xuống memoized child.
- Dùng `useMemo`/`useCallback` khi có lý do rõ, không dùng tràn lan.
- Dùng `key` ổn định cho list.

## Performance And Re-render Rules

Tối ưu performance theo độ đo, không tối ưu sớm vô căn. Nếu thay đổi UI/data flow có khả năng gây re-render lớn, đọc mục này trước khi code.

### React Re-render

- Không tạo component mới bên trong component cha.
- Tách component lớn thành component nhỏ: filter bar, table, summary cards, drawer form, preview panel.
- Không truyền object/array/function inline xuống child đã memoized nếu không cần.
- Dùng `useMemo` cho derived data tốn chi phí: sort/filter/map data lớn, table columns phức tạp.
- Dùng `useCallback` khi callback truyền xuống memoized child hoặc dependency của hook khác.
- Không dùng `useMemo/useCallback` tràn lan cho logic rẻ, vì làm code rối hơn mà lợi ích thấp.

### Zustand Re-render

- Selector phải hẹp:

```ts
const user = useAuthStore((state) => state.user);
```

- Không lấy cả store nếu chỉ cần một field.
- Không đưa server/API data vào Zustand để render list/detail.
- Tách action và state rõ ràng nếu store phình to.

### TanStack Query Performance

- Query key phải ổn định.
- Set `staleTime` phù hợp cho data ít đổi.
- Không refetch liên tục khi không cần.
- Sau mutation chỉ invalidate query liên quan.
- Không clear toàn bộ cache trừ auth/logout.
- Không copy query data sang local state/Zustand chỉ để render.

### Table/List

- Table/list lớn phải có pagination; ưu tiên server-side pagination khi data lớn.
- `rowKey` phải ổn định.
- Column config phức tạp nên tách ra hook hoặc `useMemo`.
- Tránh render cell quá nặng trong AntD Table.
- Nếu list rất lớn mới tính virtualization.

### Form

- Không để toàn bộ page re-render theo từng field nếu form lớn.
- Tách form lớn thành section component.
- Đặt submit/business handler trong hook/container, không nhét logic dài vào JSX.
- Không watch quá nhiều field nếu không cần.

### Code Splitting And Assets

- Route-level code splitting đã có qua TanStack Router.
- Component nặng như editor, video preview, asset picker, chart nên lazy load khi chỉ mở theo nhu cầu.
- Không import ảnh/video lớn vào bundle nếu không cần.
- Preview asset/video nên lazy load.

## Validation Trước Khi Kết Thúc

Bắt buộc chạy:

```bash
yarn check:type
yarn build
```

Nên chạy thêm:

```bash
yarn test
```

Nếu có UI thay đổi:

- Mở local app.
- Kiểm tra route mới render không trắng.
- Kiểm tra console error.
- Kiểm tra layout không vỡ trên desktop.

Nếu không chạy được lệnh nào, phải báo rõ lý do.
