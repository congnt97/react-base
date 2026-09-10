import { useEffect, useRef } from 'react';

/**
 * Trả về hàm gọi trễ `delay` ms sau lần gọi cuối. Dùng cho ô tìm kiếm để không
 * bắn request mỗi lần gõ. Timer được dọn khi unmount nên không set state sau đó.
 *
 * `callback` giữ trong ref: lần gọi luôn dùng bản mới nhất mà không cần đưa vào
 * dependency, nên hàm trả về ổn định qua các lần render.
 */
export function useDebouncedCallback<TArgs extends unknown[]>(
  callback: (...args: TArgs) => void,
  delay = 400,
) {
  const callbackRef = useRef(callback);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    callbackRef.current = callback;
  });

  useEffect(() => () => clearTimeout(timerRef.current), []);

  return (...args: TArgs) => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => callbackRef.current(...args), delay);
  };
}
