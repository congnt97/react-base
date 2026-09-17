import {
  Popconfirm as AntPopconfirm,
  type PopconfirmProps as AntPopconfirmProps,
} from 'antd';
import { useState } from 'react';

import { useAsyncAction } from '@/core/hooks/use-async-action';

type PopconfirmProps = Omit<
  AntPopconfirmProps,
  'onConfirm' | 'okText' | 'cancelText' | 'open' | 'onOpenChange'
> & {
  /** Must have clear wording; don't use the default "OK/Cancel". */
  okText: string;
  cancelText: string;
  /** A destructive action: red OK button. */
  danger?: boolean;
  /** If it returns a Promise, the OK button shows loading, cancel is locked, and a repeat click is ignored until done. */
  onConfirm?: () => unknown;
};

/**
 * Popconfirm wrapper: clear wording, blocks a duplicate confirm, only closes once the
 * action finishes (stays open on error so the user can retry; the error has already been
 * toasted in the mutation). Features must use this wrapper.
 */
export function Popconfirm({
  onConfirm,
  danger,
  okButtonProps,
  cancelButtonProps,
  ...props
}: PopconfirmProps) {
  const [open, setOpen] = useState(false);
  const action = useAsyncAction(async () => {
    await onConfirm?.();
  });

  const handleConfirm = () =>
    void action.run().then(
      (ran) => {
        if (ran) {
          setOpen(false);
        }
      },
      // The error has already been toasted in the mutation; keep the popover open to retry.
      () => undefined,
    );

  return (
    <AntPopconfirm
      open={open}
      // AntD closes it immediately when onConfirm doesn't return a Promise; ignore while running.
      onOpenChange={(next) => {
        if (!action.isRunning()) {
          setOpen(next);
        }
      }}
      okButtonProps={{ danger, ...okButtonProps, loading: action.pending }}
      cancelButtonProps={{ ...cancelButtonProps, disabled: action.pending }}
      onConfirm={onConfirm ? handleConfirm : () => setOpen(false)}
      {...props}
    />
  );
}
