import { Button as AntButton, type ButtonProps as AntButtonProps } from 'antd';
import type { MouseEvent } from 'react';

import { useAsyncAction } from '@/core/hooks/use-async-action';

type ButtonProps = Omit<AntButtonProps, 'onClick'> & {
  /** Returning a Promise makes the button `loading` and ignores clicks while running (blocks click spam). */
  onClick?: (event: MouseEvent<HTMLElement>) => unknown;
};

/**
 * Button wrapper: an async action doesn't need to manage its own loading state or disable the button.
 * Features must use this instead of antd's Button (ESLint blocks it).
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
