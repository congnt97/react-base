import { Modal as AntModal, type ModalProps as AntModalProps } from 'antd';

import { useAsyncAction } from '@/core/hooks/use-async-action';

type ModalProps = Omit<AntModalProps, 'onOk' | 'confirmLoading'> & {
  /** If it returns a Promise, the modal locks itself (mask, ESC, close button, cancel button) until done. */
  onOk?: () => unknown;
  /** Submitting from outside (e.g. `mutation.isPending`); locks the same way. */
  submitting?: boolean;
};

/**
 * Modal wrapper: while submitting, it can't be closed via mask/ESC/X button, cancel is
 * disabled, OK shows loading; reopening always gets a fresh form (`destroyOnHidden`).
 * Features must use this wrapper.
 */
export function Modal({
  onOk,
  submitting = false,
  maskClosable = true,
  keyboard = true,
  closable = true,
  cancelButtonProps,
  ...props
}: ModalProps) {
  const action = useAsyncAction(async () => {
    await onOk?.();
  });
  const locked = submitting || action.pending;

  return (
    <AntModal
      destroyOnHidden
      confirmLoading={locked}
      // AntD 6.6 deprecates maskClosable in favor of mask.closable (keeps enabled defaulting to true).
      mask={{ closable: maskClosable && !locked }}
      keyboard={keyboard && !locked}
      closable={closable && !locked}
      cancelButtonProps={{ ...cancelButtonProps, disabled: locked }}
      onOk={onOk ? () => void action.run() : undefined}
      {...props}
    />
  );
}
