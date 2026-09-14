import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { SearchInput } from '@/components/ui/search-input';

// Timer thật đua với tốc độ gõ của userEvent: dưới tải (máy chậm, chạy cùng
// coverage), gõ "dự án" có thể mất hơn khoảng debounce, khiến nó bắn giữa chừng
// với giá trị dở dang rồi test đỏ ngẫu nhiên. Timer giả loại bỏ hẳn cuộc đua đó.
beforeEach(() => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
});
afterEach(() => {
  vi.useRealTimers();
});

const setupUser = () =>
  userEvent.setup({ advanceTimers: vi.advanceTimersByTime.bind(vi) });

describe('SearchInput', () => {
  it('gõ liên tục chỉ tìm một lần sau khi ngừng gõ', async () => {
    const user = setupUser();
    const onSearch = vi.fn();
    render(<SearchInput aria-label="Tìm" onSearch={onSearch} delay={400} />);

    await user.type(screen.getByLabelText('Tìm'), 'dự án');

    expect(onSearch).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(400);
    expect(onSearch).toHaveBeenCalledTimes(1);
    expect(onSearch).toHaveBeenCalledWith('dự án');
  });

  it('Enter tìm ngay; xoá trắng thì trả undefined để bỏ filter', async () => {
    const user = setupUser();
    const onSearch = vi.fn();
    render(
      <SearchInput
        aria-label="Tìm"
        defaultValue="abc"
        onSearch={onSearch}
        delay={400}
      />,
    );
    const input = screen.getByLabelText('Tìm');

    await user.type(input, '{Enter}');
    expect(onSearch).toHaveBeenLastCalledWith('abc');

    await user.clear(input);
    await vi.advanceTimersByTimeAsync(400);
    expect(onSearch).toHaveBeenLastCalledWith(undefined);
  });
});
