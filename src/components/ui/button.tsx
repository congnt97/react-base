import { Button as AntButton, type ButtonProps as AntButtonProps } from 'antd';
import type { MouseEvent } from 'react';

import { useAsyncAction } from '@/core/hooks/use-async-action';

type ButtonProps = Omit<AntButtonProps, 'onClick'> & {
  /** Trả Promise thì nút tự `loading` và bỏ qua click khi đang chạy (chặn click spam). */
  onClick?: (event: MouseEvent<HTMLElement>) => unknown;
};

/**
 * Bản bọc Button: hành động async không cần tự quản lý loading hay khoá nút.
 * Feature phải dùng bản này thay vì antd Button (ESLint chặn).
 */
export function Button({ onClick, loading, ...props }: ButtonProps) {
  const action = useAsyncAction(async (event: MouseEvent<HTMLElement>) => {
    await onClick?.(event);
  });

  return (
    <AntButton
      loading={loading ?? action.pending}
      onClick={onClick ? (event) => void action.run(event) : undefined}
      {...props}
    />
  );
}
