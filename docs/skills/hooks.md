# Hooks Rules

Đọc khi có `useEffect`, subscription, timer, DOM API, custom hook.

## Máy đã ép

`react-hooks/*` (bộ rule React Compiler) bắt: setState trong effect, derived state trong effect, mutate trong render, đọc ref lúc render, thiếu dependency, memo tay sai dependency. Import `axios` ngoài `lib/http.ts` bị chặn nên không fetch được bằng effect.

## `useEffect` chỉ để đồng bộ với thứ ngoài React

DOM API (focus, measure), subscription (WebSocket, event listener), timer, thư viện ngoài (map, editor). Ngoài các trường hợp đó gần như chắc chắn không cần effect:

- Derived value: tính thẳng trong render. Compiler memo.
- Data từ Query: dùng thẳng `data`, không copy sang state.
- Phản ứng user action: gọi trong handler, không set flag rồi effect canh.

## Bắt buộc khi dùng effect

- Subscription, timer, listener phải return cleanup. Mẫu: `components/ui/scroll-hint.tsx`.
- Effect chạy đúng một lần lúc mount: dependency rỗng kèm một dòng comment vì sao, vì mảng rỗng dễ bị hiểu là bug.
- Không gây vòng lặp: không set state mà effect lại phụ thuộc chính state đó.

## Custom hook

- Đặt ở `features/<x>/hooks/` (biết feature) hoặc `components/hooks/` (dùng chung, không biết feature). Không đặt trong `lib` vì `lib` không import React.
- Tên nói đúng việc nó làm, không side-effect ẩn.
- Trả về đúng thứ nơi gọi cần, không trả nguyên object nội bộ.
