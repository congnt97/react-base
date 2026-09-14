# Testing Rules

Đọc khi viết/sửa test hoặc quyết định có nên test.

## Máy đã ép

- Coverage `lib/**`, `core/**`, `features/*/search|guards|permissions` dưới ngưỡng: CI đỏ.
- Test hành vi cho hook core và adapter UI (`core/**/*.test.*`, `components/ui/*.test.tsx`) chạy cùng `pnpm test`; đây là guard chính cho `docs/skills/pitfalls.md`, không dựa vào E2E.
- Vitest chỉ chạy `src/**/*.test.{ts,tsx}`; `e2e/*.spec.ts` là Playwright.
- Hai test đối chiếu (endpoint↔MSW, `t()`↔`en.json`) chạy cùng `pnpm test`.

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

## Test có debounce/timer

Không dùng `delay` ngắn (vd 50ms) với timer thật: tốc độ gõ của `userEvent` đua với
đồng hồ thật, và dưới tải (CI, chạy cùng `--coverage`) việc gõ có thể chậm hơn
khoảng debounce, khiến test đỏ ngẫu nhiên dù component đúng. Dùng timer giả với
`shouldAdvanceTime: true` (tránh treo do React scheduler không tick), rồi
`advanceTimersByTimeAsync` để bắn debounce một cách xác định:

```ts
beforeEach(() => vi.useFakeTimers({ shouldAdvanceTime: true }));
afterEach(() => vi.useRealTimers());

const user = userEvent.setup({
  advanceTimers: vi.advanceTimersByTime.bind(vi),
});
await user.type(input, 'từ khoá');
expect(onSearch).not.toHaveBeenCalled();
await vi.advanceTimersByTimeAsync(400); // >= delay thật của component
expect(onSearch).toHaveBeenCalledWith('từ khoá');
```

Mẫu: `components/ui/search-input.test.tsx`, `search-select.test.tsx`.

## E2E (Playwright)

- Test ở `e2e/*.spec.ts`, chạy `pnpm test:e2e` (`test:e2e:ui` để debug). Config `playwright.config.ts` tự bật `pnpm dev` với MSW nên không cần backend.
- Chỉ E2E luồng quan trọng xuyên nhiều màn: login/logout/redirect, CRUD chính, permission. Không E2E từng nhánh validate (đã có component test).
- Query theo role/label như component test. AntD: option của `Select` dùng `getByTitle`, modal dùng `getByRole('dialog')`, toast dùng `getByText`.
- Helper dùng chung (`login`) đặt ở `e2e/helpers.ts`. Data MSW reset mỗi page load nên test độc lập nhau.
- CI chạy E2E ở job riêng sau job check; report upload khi fail.
- `e2e/a11y.spec.ts` quét axe từng trang; trang mới phải thêm vào đây.

## Coverage

`pnpm test:coverage` (CI chạy thay `pnpm test`) đo `lib/**`, `features/*/search.ts`, `guards.ts`, `permissions.ts` — logic thuần dễ sai và đắt khi hỏng. UI, page, mock không tính vì đã có component test và E2E.

Ngưỡng đặt sát mức đang đạt, nên thêm hàm mới vào các file đó mà không test là CI đỏ ngay. Hạ ngưỡng phải ghi lý do trong PR.

## Test Đối Chiếu (guard)

Hai test chạy cùng `pnpm test`, không cần viết thêm, chỉ cần biết vì sao đỏ:

- `src/mocks/handlers.test.ts`: mọi path trong `lib/endpoints.ts` phải có MSW handler.
- `src/app/i18n.test.ts`: mọi `t('...')` tĩnh trong `src` phải có key trong `locales/en.json`. Key động qua map (`t(PROJECT_STATUS_LABELS[x])`) không quét được, tự thêm.

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
