import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useDebouncedCallback } from '@/components/hooks/use-debounced-callback';

describe('useDebouncedCallback', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('chỉ gọi một lần với đối số cuối cùng', () => {
    const spy = vi.fn();
    const { result } = renderHook(() => useDebouncedCallback(spy, 300));

    act(() => {
      result.current('a');
      result.current('ab');
      result.current('abc');
    });
    expect(spy).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('abc');
  });

  it('dùng callback mới nhất mà không cần tạo lại hàm', () => {
    const first = vi.fn();
    const second = vi.fn();
    const { result, rerender } = renderHook(
      ({ callback }) => useDebouncedCallback(callback, 300),
      { initialProps: { callback: first } },
    );

    const debounced = result.current;
    act(() => {
      debounced('x');
    });
    rerender({ callback: second });
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledWith('x');
  });

  it('không gọi sau khi unmount', () => {
    const spy = vi.fn();
    const { result, unmount } = renderHook(() =>
      useDebouncedCallback(spy, 300),
    );

    act(() => {
      result.current('a');
    });
    unmount();
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(spy).not.toHaveBeenCalled();
  });
});
