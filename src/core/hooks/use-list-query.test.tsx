import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { useListQuery } from '@/core/hooks/use-list-query';

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider
    client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}
  >
    {children}
  </QueryClientProvider>
);

const page = (items: string[], total: number) =>
  Promise.resolve({ items, total, page: 1, pageSize: 10 });

describe('useListQuery', () => {
  it('query bị tắt thì không kẹt ở loading', () => {
    const { result } = renderHook(
      () =>
        useListQuery({
          queryKey: ['x'],
          queryFn: () => page(['a'], 1),
          enabled: false,
          page: 1,
          pageSize: 10,
        }),
      { wrapper },
    );

    expect(result.current.isLoading).toBe(false);
    expect(result.current.items).toEqual([]);
  });

  it('loading lần đầu rồi có data', async () => {
    const { result } = renderHook(
      () =>
        useListQuery({
          queryKey: ['y'],
          queryFn: () => page(['a', 'b'], 2),
          page: 1,
          pageSize: 10,
        }),
      { wrapper },
    );

    expect(result.current.isLoading).toBe(true);
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.items).toEqual(['a', 'b']);
    expect(result.current.total).toBe(2);
  });

  it('trang trống mà còn dữ liệu thì báo lùi về trang cuối hợp lệ', async () => {
    const onPageOverflow = vi.fn();
    renderHook(
      () =>
        useListQuery({
          queryKey: ['z'],
          queryFn: () => page([], 12),
          page: 3,
          pageSize: 10,
          onPageOverflow,
        }),
      { wrapper },
    );

    await waitFor(() => expect(onPageOverflow).toHaveBeenCalledWith(2));
  });

  it('trang 1 trống thật thì không báo tràn', async () => {
    const onPageOverflow = vi.fn();
    const { result } = renderHook(
      () =>
        useListQuery({
          queryKey: ['w'],
          queryFn: () => page([], 0),
          page: 1,
          pageSize: 10,
          onPageOverflow,
        }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(onPageOverflow).not.toHaveBeenCalled();
  });

  it('lỗi thì isError và có error, refetch gọi lại được', async () => {
    const queryFn = vi
      .fn()
      .mockRejectedValueOnce(new Error('mạng'))
      .mockResolvedValueOnce({
        items: ['ok'],
        total: 1,
        page: 1,
        pageSize: 10,
      });
    const { result } = renderHook(
      () =>
        useListQuery<string>({
          queryKey: ['e'],
          queryFn,
          page: 1,
          pageSize: 10,
        }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect((result.current.error as Error).message).toBe('mạng');

    result.current.refetch();
    await waitFor(() => expect(result.current.items).toEqual(['ok']));
  });
});
