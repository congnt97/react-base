import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { App } from 'antd';
import { describe, expect, it, vi } from 'vitest';

import { useConfirm } from '@/components/ui/use-confirm';
import type { ConfirmOptions } from '@/core/contracts';

function Harness({
  options,
  onResult,
}: {
  options: ConfirmOptions;
  onResult: (value: boolean) => void;
}) {
  const confirm = useConfirm();
  return (
    <button type="button" onClick={() => void confirm(options).then(onResult)}>
      mở
    </button>
  );
}

const setup = (options: Partial<ConfirmOptions> = {}) => {
  const onResult = vi.fn();
  render(
    <App>
      <Harness
        options={{
          title: 'Xoá?',
          okText: 'Xoá',
          cancelText: 'Huỷ',
          ...options,
        }}
        onResult={onResult}
      />
    </App>,
  );
  return { onResult };
};

describe('useConfirm', () => {
  it('huỷ thì trả false', async () => {
    const { onResult } = setup();
    await userEvent.click(screen.getByRole('button', { name: 'mở' }));
    await userEvent.click(await screen.findByRole('button', { name: 'Huỷ' }));
    await waitFor(() => expect(onResult).toHaveBeenCalledWith(false));
  });

  it('xác nhận thì chạy onConfirm rồi trả true, nút OK có danger', async () => {
    const onConfirm = vi.fn(() => Promise.resolve());
    const { onResult } = setup({ danger: true, onConfirm });
    await userEvent.click(screen.getByRole('button', { name: 'mở' }));

    const ok = await screen.findByRole('button', { name: 'Xoá' });
    expect(ok).toHaveClass('ant-btn-dangerous');
    await userEvent.click(ok);

    await waitFor(() => expect(onResult).toHaveBeenCalledWith(true));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('onConfirm lỗi thì trả false, không ném ra ngoài', async () => {
    const { onResult } = setup({
      onConfirm: () => Promise.reject(new Error('x')),
    });
    await userEvent.click(screen.getByRole('button', { name: 'mở' }));
    await userEvent.click(await screen.findByRole('button', { name: 'Xoá' }));
    await waitFor(() => expect(onResult).toHaveBeenCalledWith(false));
  });
});
