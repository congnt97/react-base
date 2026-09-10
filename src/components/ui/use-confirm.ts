import { App } from 'antd';

import type { ConfirmFn } from '@/core/contracts';

/**
 * Hộp thoại xác nhận theo contract core: luôn có nút huỷ, hành động phá huỷ có
 * `danger`. `onConfirm` trả Promise thì nút OK loading và không bấm được lần hai;
 * lỗi đã được toast ở mutation nên chỉ đóng hộp thoại.
 */
export function useConfirm(): ConfirmFn {
  const { modal } = App.useApp();

  return (options) =>
    new Promise((resolve) => {
      modal.confirm({
        title: options.title,
        content: options.content,
        okText: options.okText,
        cancelText: options.cancelText,
        okButtonProps: { danger: options.danger },
        onOk: () =>
          Promise.resolve(options.onConfirm?.()).then(
            () => resolve(true),
            () => resolve(false),
          ),
        onCancel: () => resolve(false),
      });
    });
}
