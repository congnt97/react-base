# Testing Rules

Đọc file này khi task viết/sửa test, thêm `*.test.ts(x)`, mock repository/API trong test, hoặc khi task yêu cầu chạy `yarn test`.

Stack: Vitest + Testing Library + jsdom. Setup: `src/test/setup.ts`. Alias `@/` đã cấu hình trong `vitest.config.ts`.

## Ưu Tiên Test Gì

Theo thứ tự giá trị, làm trước những gì rẻ và ổn định nhất:

1. **Pure function trong `shared`/`domain`**: `buildUrl`, `auth-storage`, validation schema, formatter. Rẻ, nhanh, không mock gì — ưu tiên cao nhất.
2. **Repository impl** (mock HTTP layer, verify request/response mapping đúng, đặc biệt chỗ transform response như `unwrapResponse`).
3. **Hook logic phức tạp** (custom hook có business logic riêng ngoài gọi thẳng Query/Mutation).
4. **Component UI phức tạp có logic riêng** (conditional render nhiều nhánh, form validation tuỳ biến).

Không bắt buộc test:

- Component chỉ compose layout/container khác (page file, container orchestration đơn thuần).
- Wrapper mỏng quanh Ant Design không thêm logic.
- Route file (`route.tsx`) chỉ khai báo `createFileRoute`.

## Nguyên Tắc

- Test hành vi (input → output/effect quan sát được), không test chi tiết implementation (không assert internal state, không spy vào hàm nội bộ không export).
- 1 test file colocate cạnh file được test: `url.ts` → `url.test.ts`.
- Tên test bằng tiếng Việt, mô tả rõ hành vi: `it('trả về null khi storage chứa giá trị không parse được', ...)`.
- Không mock những gì không cần mock. Pure function/util không cần mock dependency nếu dependency đó cũng đơn giản (vd `localStorage` dùng thật qua jsdom, không mock).
- Mock ở boundary ngoài cùng (HTTP, `localStorage` nếu cần kiểm soát), không mock internal module cùng layer với nhau.
- Test lỗi/edge case, không chỉ test happy path: input rỗng, giá trị `0`/`''`/`false`, request thất bại, storage chứa data hỏng.

## Không Làm

Không viết test giả để tăng coverage mà không assert gì có ý nghĩa:

```ts
it('renders', () => {
  render(<Component />);
  expect(true).toBe(true);
});
```

Không test trực tiếp implementation detail dễ vỡ khi refactor (class name CSS, cấu trúc DOM nội bộ của Ant Design).

## Khi Nào Bắt Buộc Thêm Test

- Thêm/sửa pure function trong `shared` có logic rẽ nhánh (không phải getter đơn giản).
- Fix bug đã từng xảy ra thật — thêm test tái hiện đúng case đó để tránh regression.
- Thêm repository impl mới có transform response phức tạp hơn `unwrapResponse` đơn giản.

## Rule Ngắn

```text
Test hành vi, không test implementation detail.
Pure function trong shared/domain -> ưu tiên test trước.
Page/container compose thuần -> không bắt buộc test.
Mock ở boundary ngoài cùng, không mock nội bộ cùng layer.
Fix bug thật -> luôn thêm test tái hiện.
```
