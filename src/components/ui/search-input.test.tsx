import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { SearchInput } from '@/components/ui/search-input';

describe('SearchInput', () => {
  it('gõ liên tục chỉ tìm một lần sau khi ngừng gõ', async () => {
    const onSearch = vi.fn();
    render(<SearchInput aria-label="Tìm" onSearch={onSearch} delay={50} />);

    await userEvent.type(screen.getByLabelText('Tìm'), 'dự án');

    expect(onSearch).not.toHaveBeenCalled();
    await waitFor(() => expect(onSearch).toHaveBeenCalledTimes(1));
    expect(onSearch).toHaveBeenCalledWith('dự án');
  });

  it('Enter tìm ngay; xoá trắng thì trả undefined để bỏ filter', async () => {
    const onSearch = vi.fn();
    render(
      <SearchInput
        aria-label="Tìm"
        defaultValue="abc"
        onSearch={onSearch}
        delay={50}
      />,
    );
    const input = screen.getByLabelText('Tìm');

    await userEvent.type(input, '{Enter}');
    expect(onSearch).toHaveBeenLastCalledWith('abc');

    await userEvent.clear(input);
    await waitFor(() => expect(onSearch).toHaveBeenLastCalledWith(undefined));
  });
});
