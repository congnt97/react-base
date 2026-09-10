# Quality Rules

Đọc khi có fallback/default value, tách file, performance, error handling, monitoring.

## Máy đã ép

- Không `console.log`, không throw string, không promise bỏ lửng, không empty catch: ESLint.
- Code chết (file/export/dependency không dùng): knip trong `validate`.
- Bundle vượt ngân sách: `pnpm size` trong CI. Ngân sách ở `scripts/check-bundle-size.mjs`.
- Coverage `lib/**`, `core/**`, `search/guards/permissions` dưới ngưỡng: `pnpm test:coverage` trong CI.
- Memo tay sai dependency, setState trong effect, mutate trong render: `react-hooks/*`.

## Fallback

Không dùng giá trị giả để che data required thiếu. Fallback giả làm UI trông đúng trong khi production đang hỏng.

- Required thiếu: hiện `ErrorState`, redirect, hoặc throw theo flow.
- Optional thiếu: text trung thực, `user?.name ?? t('Chưa cập nhật')`.
- `??` chứ không `||` khi `0`, `''`, `false` là giá trị hợp lệ.
- Data demo chỉ trong `src/mocks`.

## Tách file

File gần 400 dòng thì tách: columns, form, filter, sub-component, hook. Không định nghĩa component bên trong component khác. Logic dài để trong hook hoặc page, không nhét trong JSX.

## Performance

React Compiler đã memo mọi component và hook. Việc còn lại là của người viết:

- Tách component lớn (filter, table, form) để re-render cục bộ.
- Zustand selector hẹp: `useAuthStore((s) => s.user)`, không lấy cả store.
- Bảng lớn: pagination server-side, `rowKey` ổn định. Chỉ tính virtualization khi thật sự cần.
- Component nặng (editor, chart, preview) lazy load theo nhu cầu.
- Nghi ngờ re-render thừa thì đo bằng React DevTools Profiler, không đoán.
- Thêm lib lớn thì chạy `pnpm build:analyze` soi `dist/stats.html` trước khi merge.

## Error handling

- Lỗi API là `ApiError`; UI lấy message qua `getErrorMessage`. Chi tiết ở `api.md`.
- Không hiện raw message backend chứa stack trace hay tên field nội bộ.
- Router có `defaultErrorComponent` nên lỗi một route không làm trắng cả app. Feature rủi ro cao (editor, preview) cân nhắc boundary riêng.

## Monitoring

`lib/monitoring.ts` đã tự nối vào QueryCache, MutationCache, RouteError, `window.error`, auth store. Lỗi 4xx không báo (nghiệp vụ), 5xx và lỗi JS thì báo, kèm `requestId`. Feature không cần gọi tay. Cắm SDK thật chỉ ở `app/monitoring.ts`.
