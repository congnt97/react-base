# Testing Rules

Đọc khi viết/sửa test hoặc quyết định có nên test.

Stack: Vitest + Testing Library + jsdom. Setup `src/test/setup.ts` đã polyfill `matchMedia`, `ResizeObserver` cho Ant Design.

## Ưu Tiên

1. Pure function trong `lib/` và `features/*/search.ts`, `guards.ts`: rẻ, không mock. Ưu tiên cao nhất.
2. Component có logic riêng (form validation, nhiều nhánh render): test hành vi qua Testing Library. Mẫu: `project-form-modal.test.tsx`.
3. Hook có business logic ngoài gọi thẳng Query/Mutation.

Không bắt buộc test: page chỉ compose, wrapper mỏng quanh AntD, route file.

## Nguyên Tắc

- Test hành vi quan sát được, không test implementation detail (class CSS, DOM nội bộ AntD).
- Colocate: `url.ts` -> `url.test.ts`.
- Tên test tiếng Việt mô tả hành vi.
- Component test: query theo role/label (`getByRole('button', { name: 'Lưu' })`, `getByLabelText('Tên dự án')`). Muốn query được thì component phải có label/aria-label đúng, đây cũng là yêu cầu a11y.
- Component nhận props thuần (như `ProjectFormModal`) dễ test hơn component tự gọi hook/API. Tách theo hướng đó.
- Mock ở boundary ngoài cùng. Cần mock API trong test thì dùng MSW với `setupServer(...handlers)` từ `mocks/handlers`, không mock module nội bộ.
- Test edge case: rỗng, `0`/`''`/`false`, lỗi, data hỏng.

## Bắt Buộc Thêm Test Khi

- Thêm/sửa pure function có rẽ nhánh.
- Fix bug thật: thêm test tái hiện.
- Form/component mới có validation hoặc điều kiện render phức tạp.

## Không Làm

```ts
it('renders', () => {
  render(<Component />);
  expect(true).toBe(true);
});
```
