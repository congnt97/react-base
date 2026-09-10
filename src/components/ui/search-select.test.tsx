import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { SearchSelect } from '@/components/ui/search-select';

describe('SearchSelect', () => {
  it('gõ liên tục chỉ gọi search một lần, chọn thì trả value', async () => {
    const search = vi.fn((keyword: string) =>
      Promise.resolve([{ value: 'u1', label: `Người ${keyword}` }]),
    );
    const onChange = vi.fn();
    render(
      <SearchSelect aria-label="Quản lý" search={search} onChange={onChange} />,
    );

    await userEvent.type(
      screen.getByRole('combobox', { name: 'Quản lý' }),
      'lan',
    );

    await waitFor(() => expect(search).toHaveBeenCalledTimes(1));
    expect(search.mock.calls[0]?.[0]).toBe('lan');
    await userEvent.click(await screen.findByText('Người lan'));
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
