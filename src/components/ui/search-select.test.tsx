import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { SearchSelect } from '@/components/ui/search-select';

// Real timers race userEvent's typing speed: under load, the debounce (300ms default in
// useAsyncOptions) can fire mid-way with a partial keyword, causing `search` to be called
// with "la" instead of "lan" and turning the test randomly flaky. Fake timers remove that
// race entirely — see also search-input.test.tsx.
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
