import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { useDetailQuery } from '@/core/hooks/use-detail-query';

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider
    client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}
  >
    {children}
  </QueryClientProvider>
);

describe('useDetailQuery', () => {
  it('chưa có id (enabled false) thì không kẹt loading, không gọi API', () => {
    const queryFn = vi.fn(() => Promise.resolve({ id: '1' }));
    const { result } = renderHook(
      () => useDetailQuery({ queryKey: ['d', ''], queryFn, enabled: false }),
      { wrapper },
    );

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeUndefined();
    expect(queryFn).not.toHaveBeenCalled();
  });

  it('tải xong có data; lỗi thì isError và refetch gọi lại được', async () => {
    const queryFn = vi
      .fn()
      .mockRejectedValueOnce(new Error('404'))
      .mockResolvedValueOnce({ id: '1' });
    const { result } = renderHook(
      () => useDetailQuery<{ id: string }>({ queryKey: ['d', '1'], queryFn }),
      { wrapper },
    );

    expect(result.current.isLoading).toBe(true);
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect((result.current.error as Error).message).toBe('404');

    result.current.refetch();
    await waitFor(() => expect(result.current.data).toEqual({ id: '1' }));
    expect(result.current.isLoading).toBe(false);
  });
});
