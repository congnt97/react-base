import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useAsyncAction } from '@/core/hooks/use-async-action';

const deferred = () => {
  let resolve!: () => void;
  let reject!: (error: unknown) => void;
  const promise = new Promise<void>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
};

describe('useAsyncAction', () => {
  it('gọi 3 lần liên tiếp khi đang chạy thì action chỉ chạy 1 lần', async () => {
    const gate = deferred();
    const action = vi.fn(() => gate.promise);
    const { result } = renderHook(() => useAsyncAction(action));

    let first: Promise<boolean> = Promise.resolve(false);
    let second: Promise<boolean> = Promise.resolve(false);
    act(() => {
      first = result.current.run();
      second = result.current.run();
      void result.current.run();
    });

    expect(action).toHaveBeenCalledTimes(1);
    expect(result.current.pending).toBe(true);
    expect(result.current.isRunning()).toBe(true);
    await expect(second).resolves.toBe(false);

    gate.resolve();
    await act(async () => {
      await expect(first).resolves.toBe(true);
    });
    expect(result.current.pending).toBe(false);
  });

  it('chạy xong thì gọi lại được', async () => {
    const action = vi.fn(() => Promise.resolve());
    const { result } = renderHook(() => useAsyncAction(action));

    await act(async () => {
      await result.current.run();
    });
    await act(async () => {
      await result.current.run();
    });

    expect(action).toHaveBeenCalledTimes(2);
  });

  it('action lỗi thì pending vẫn về false và lỗi được ném ra', async () => {
    const action = vi.fn(() => Promise.reject(new Error('hỏng')));
    const { result } = renderHook(() => useAsyncAction(action));

    await expect(
      act(async () => {
        await result.current.run();
      }),
    ).rejects.toThrow('hỏng');
    expect(result.current.pending).toBe(false);
  });

  it('truyền đối số xuống action', async () => {
    const action = vi.fn((id: string) => Promise.resolve(id));
    const { result } = renderHook(() => useAsyncAction(action));

    await act(async () => {
      await result.current.run('p1');
    });

    expect(action).toHaveBeenCalledWith('p1');
  });
});
