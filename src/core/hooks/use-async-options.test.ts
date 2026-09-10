import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useAsyncOptions } from '@/core/hooks/use-async-options';

describe('useAsyncOptions', () => {
  it('gõ liên tục chỉ gọi search một lần với từ khoá cuối', async () => {
    const search = vi.fn((keyword: string) => Promise.resolve([keyword]));
    const { result } = renderHook(() => useAsyncOptions(search, { delay: 20 }));

    act(() => {
      result.current.onSearch('a');
      result.current.onSearch('ab');
      result.current.onSearch('abc');
    });

    await waitFor(() => expect(result.current.options).toEqual(['abc']));
    expect(search).toHaveBeenCalledTimes(1);
    expect(result.current.loading).toBe(false);
  });

  it('response cũ về sau response mới thì bị bỏ', async () => {
    const pending = new Map<string, (value: string[]) => void>();
    const search = vi.fn(
      (keyword: string) =>
        new Promise<string[]>((resolve) => pending.set(keyword, resolve)),
    );
    const { result } = renderHook(() => useAsyncOptions(search, { delay: 0 }));

    act(() => result.current.onSearch('slow'));
    await waitFor(() => expect(pending.has('slow')).toBe(true));
    act(() => result.current.onSearch('fast'));
    await waitFor(() => expect(pending.has('fast')).toBe(true));

    act(() => pending.get('fast')?.(['kết quả mới']));
    await waitFor(() =>
      expect(result.current.options).toEqual(['kết quả mới']),
    );

    act(() => pending.get('slow')?.(['kết quả cũ']));
    await new Promise((resolve) => setTimeout(resolve, 10));
    expect(result.current.options).toEqual(['kết quả mới']);
  });

  it('ngắn hơn minLength thì không gọi và options rỗng', async () => {
    const search = vi.fn(() => Promise.resolve(['x']));
    const { result } = renderHook(() =>
      useAsyncOptions(search, { delay: 0, minLength: 2 }),
    );

    act(() => result.current.onSearch('a'));
    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(search).not.toHaveBeenCalled();
    expect(result.current.options).toEqual([]);
  });

  it('lỗi thì loading tắt và có error', async () => {
    const search = vi.fn(() => Promise.reject(new Error('mạng')));
    const { result } = renderHook(() => useAsyncOptions(search, { delay: 0 }));

    act(() => result.current.onSearch('x'));

    await waitFor(() => expect(result.current.error).toBeInstanceOf(Error));
    expect(result.current.loading).toBe(false);
  });
});
