import { useRef, useState } from 'react';

import type { AsyncAction } from '@/core/contracts';

/**
 * Bọc một hành động async để chặn click spam: gọi khi đang chạy thì bỏ qua,
 * `pending` để adapter bind vào `loading` của nút.
 *
 * Dùng ref thay vì state cho cờ chạy, vì state cập nhật sau render còn click thứ hai
 * có thể tới trước khi render kịp.
 */
export function useAsyncAction<TArgs extends unknown[]>(
  action: (...args: TArgs) => Promise<unknown>,
): AsyncAction<TArgs> {
  const runningRef = useRef(false);
  const [pending, setPending] = useState(false);

  const run = async (...args: TArgs) => {
    if (runningRef.current) {
      return false;
    }
    runningRef.current = true;
    setPending(true);
    try {
      await action(...args);
      return true;
    } finally {
      runningRef.current = false;
      setPending(false);
    }
  };

  return { run, pending, isRunning: () => runningRef.current };
}
