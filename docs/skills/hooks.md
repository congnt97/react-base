# Hooks And Effect Rules

Đọc file này khi task có `useEffect`, side effect, sync state, subscription, cleanup, custom hook, derived state.

Đây là nhóm lỗi phổ biến nhất của dev React: dùng `useEffect` để làm việc mà render/event handler/derived value đã giải quyết được.

## Khi Nào Mới Dùng `useEffect`

`useEffect` chỉ dùng để đồng bộ component với hệ thống **bên ngoài React**:

- DOM API trực tiếp (focus, measure, scroll).
- Subscription (WebSocket, event emitter, `window`/`document` event listener).
- Timer (`setTimeout`/`setInterval`).
- Tracking/analytics khi mount.
- Tích hợp thư viện ngoài không phải React (map, chart, editor).

Nếu không rơi vào nhóm trên, gần như chắc chắn không cần `useEffect`.

## Anti-Pattern Thường Gặp

### 1. Tính derived value bằng effect + state

Không làm:

```tsx
const [filtered, setFiltered] = useState<Item[]>([]);

useEffect(() => {
  setFiltered(items.filter((item) => item.active));
}, [items]);
```

Nên làm — tính thẳng trong render, `useMemo` nếu tốn chi phí:

```tsx
const filtered = useMemo(
  () => items.filter((item) => item.active),
  [items],
);
```

### 2. Đồng bộ props/query data sang state bằng effect

Không làm:

```tsx
const { data } = useProjects();
const [projects, setProjects] = useState<Project[]>([]);

useEffect(() => {
  if (data) setProjects(data);
}, [data]);
```

Nên làm — dùng thẳng `data` từ Query, không copy sang state khác.

### 3. Gọi hành động khi user tương tác bằng effect canh flag

Không làm:

```tsx
const [shouldSubmit, setShouldSubmit] = useState(false);

useEffect(() => {
  if (shouldSubmit) {
    submit();
    setShouldSubmit(false);
  }
}, [shouldSubmit]);

<Button onClick={() => setShouldSubmit(true)} />;
```

Nên làm — gọi thẳng trong handler:

```tsx
<Button onClick={() => submit()} />;
```

### 4. Fetch API bằng `useEffect` + axios

Không làm:

```tsx
useEffect(() => {
  axiosInstance.get('/projects').then((res) => setProjects(res.data));
}, []);
```

Nên làm — dùng TanStack Query qua repository/hook (xem `docs/skills/api.md`).

### 5. Tắt eslint thay vì sửa dependency

Không làm:

```tsx
useEffect(() => {
  doSomething(a, b);
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [a]);
```

Nếu thiếu dependency có chủ đích, phải hiểu rõ hệ quả và có lý do rõ ràng, không disable để né warning cho nhanh.

### 6. Effect gây vòng lặp vô hạn

Không set state trong effect mà effect đó lại phụ thuộc chính state vừa set, trừ khi có điều kiện dừng rõ ràng (so sánh giá trị mới với giá trị cũ trước khi set).

### 7. Thiếu cleanup

Subscription, timer, event listener đăng ký trong effect phải return cleanup function:

```tsx
useEffect(() => {
  const unsubscribe = subscribeSomething(handler);
  return unsubscribe;
}, [handler]);
```

## Effect Chạy Một Lần Khi Mount

Nếu thực sự cần effect chạy đúng 1 lần lúc mount (init thư viện ngoài, ping analytics), được phép dùng `useEffect(() => {...}, [])`, và đây là một trong số ít trường hợp nên có comment ngắn giải thích lý do — vì mảng dependency rỗng dễ gây hiểu lầm là bug.

## Custom Hook

- Hook chỉ nên trả về field thực sự cần dùng ở nơi gọi, không trả nguyên object nội bộ.
- Tên hook phải phản ánh đúng việc nó làm; không side-effect ẩn không liên quan tên hook (vd: `useProjects` không nên âm thầm ghi log hay đổi route).
- Business logic dài (submit, transform) đặt trong hook/container, không nhét trong JSX.

## Rule Ngắn

```text
useEffect = đồng bộ với hệ thống ngoài React, không phải nơi tính toán hay phản ứng state nội bộ.
Derived value -> tính trong render hoặc useMemo.
Sync data từ Query -> dùng thẳng, không copy qua state.
Hành động theo user action -> gọi trong event handler.
Fetch data -> TanStack Query, không useEffect + axios.
```
