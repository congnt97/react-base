import { Modal as AntModal, type ModalProps as AntModalProps } from 'antd';

import { useAsyncAction } from '@/core/hooks/use-async-action';

type ModalProps = Omit<AntModalProps, 'onOk' | 'confirmLoading'> & {
  /** Trả Promise thì modal tự khoá (mask, ESC, nút đóng, nút huỷ) tới khi xong. */
  onOk?: () => unknown;
  /** Đang gửi từ bên ngoài (vd mutation.isPending); khoá như trên. */
  submitting?: boolean;
};

/**
 * Bản bọc Modal: khi đang gửi thì không thể đóng bằng mask/ESC/nút X, nút huỷ disable,
 * nút OK loading; mở lại thì form mới (destroyOnHidden). Feature phải dùng bản này.
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
      maskClosable={maskClosable && !locked}
      keyboard={keyboard && !locked}
      closable={closable && !locked}
      cancelButtonProps={{ ...cancelButtonProps, disabled: locked }}
      onOk={onOk ? () => void action.run() : undefined}
      {...props}
    />
  );
}
