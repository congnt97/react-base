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
  /** Bắt buộc có chữ rõ nghĩa; không dùng "OK/Cancel" mặc định. */
  okText: string;
  cancelText: string;
  /** Hành động phá huỷ: nút OK đỏ. */
  danger?: boolean;
  /** Trả Promise thì nút OK loading, huỷ bị khoá, bấm lại bị bỏ qua tới khi xong. */
  onConfirm?: () => unknown;
};

/**
 * Bản bọc Popconfirm: chữ rõ nghĩa, chặn xác nhận trùng, chỉ đóng khi hành động xong
 * (lỗi thì giữ mở để thử lại; lỗi đã được toast ở mutation). Feature phải dùng bản này.
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
      // Lỗi đã được toast ở mutation; giữ popover mở để thử lại.
      () => undefined,
    );

  return (
    <AntPopconfirm
      open={open}
      // antd gọi đóng ngay khi onConfirm không trả Promise; đang chạy thì bỏ qua.
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
