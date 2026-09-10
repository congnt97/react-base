import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Modal } from '@/components/ui/modal';

const renderModal = (props: { submitting?: boolean; onOk?: () => unknown }) => {
  const onCancel = vi.fn();
  render(
    <Modal
      open
      title="Tạo"
      okText="Lưu"
      cancelText="Huỷ"
      onCancel={onCancel}
      {...props}
    >
      nội dung
    </Modal>,
  );
  return { onCancel };
};

const mask = () => document.querySelector('.ant-modal-wrap') as HTMLElement;

describe('Modal', () => {
  it('đang gửi: bấm mask, ESC, nút X, nút huỷ đều không đóng', async () => {
    const { onCancel } = renderModal({ submitting: true });

    await userEvent.click(mask());
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('button', { name: 'Close' })).toBeNull();
    expect(screen.getByRole('button', { name: 'Huỷ' })).toBeDisabled();
    expect(screen.getByRole('button', { name: /Lưu/ })).toHaveClass(
      'ant-btn-loading',
    );
    expect(onCancel).not.toHaveBeenCalled();
  });

  it('không gửi: bấm mask và ESC đóng được', async () => {
    const { onCancel } = renderModal({});

    await userEvent.click(mask());
    await userEvent.keyboard('{Escape}');

    expect(onCancel).toHaveBeenCalledTimes(2);
  });

  it('onOk trả Promise: bấm OK liên tục chỉ chạy 1 lần, huỷ bị khoá tới khi xong', async () => {
    let finish!: () => void;
    const onOk = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          finish = resolve;
        }),
    );
    const { onCancel } = renderModal({ onOk });
    const ok = screen.getByRole('button', { name: /Lưu/ });

    await userEvent.click(ok);
    await userEvent.click(ok);
    await userEvent.click(mask());

    expect(onOk).toHaveBeenCalledTimes(1);
    expect(onCancel).not.toHaveBeenCalled();

    finish();
    await waitFor(() => expect(ok).not.toHaveClass('ant-btn-loading'));
    await userEvent.click(mask());
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
