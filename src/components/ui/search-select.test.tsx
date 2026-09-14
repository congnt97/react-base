import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { SearchSelect } from '@/components/ui/search-select';

// Timer thật đua với tốc độ gõ của userEvent: dưới tải, debounce (300ms mặc định
// của useAsyncOptions) có thể bắn giữa chừng với từ khoá dở dang, khiến
// `search` bị gọi với "la" thay vì "lan" và test đỏ ngẫu nhiên. Timer giả loại
// bỏ hẳn cuộc đua đó, xem thêm search-input.test.tsx.
beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
});
afterEach(() => {
  vi.useRealTimers();
});

describe('SearchSelect', () => {
  it('gõ liên tục chỉ gọi search một lần, chọn thì trả value', async () => {
    const user = userEvent.setup({
      advanceTimers: vi.advanceTimersByTime.bind(vi),
    });
    const search = vi.fn((keyword: string) =>
      Promise.resolve([{ value: 'u1', label: `Người ${keyword}` }]),
    );
    const onChange = vi.fn();
    render(
      <SearchSelect aria-label="Quản lý" search={search} onChange={onChange} />,
    );

    await user.type(screen.getByRole('combobox', { name: 'Quản lý' }), 'lan');
    await vi.advanceTimersByTimeAsync(300);

    expect(search).toHaveBeenCalledTimes(1);
    expect(search.mock.calls[0]?.[0]).toBe('lan');
    await user.click(await screen.findByText('Người lan'));
    expect(onChange).toHaveBeenCalledWith('u1', {
      value: 'u1',
      label: 'Người lan',
    });
  });

  it('giá trị đang sửa hiện đúng label trước khi tìm', () => {
    render(
      <SearchSelect
        aria-label="Quản lý"
        search={() => Promise.resolve([])}
        value="u9"
        selectedOption={{ value: 'u9', label: 'Ngọc' }}
      />,
    );

    expect(screen.getByText('Ngọc')).toBeInTheDocument();
  });
});
