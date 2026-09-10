import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Popconfirm } from '@/components/ui/popconfirm';

describe('Popconfirm', () => {
  it('bấm xác nhận liên tục chỉ chạy 1 lần, nút OK đỏ khi danger', async () => {
    let finish!: () => void;
    const onConfirm = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          finish = resolve;
        }),
    );
    render(
      <Popconfirm
        title="Xoá dòng này?"
        okText="Xoá"
        cancelText="Huỷ"
        danger
        onConfirm={onConfirm}
      >
        <button type="button">xoá</button>
      </Popconfirm>,
    );

    await userEvent.click(screen.getByRole('button', { name: 'xoá' }));
    const ok = await screen.findByRole('button', { name: 'Xoá' });
    expect(ok).toHaveClass('ant-btn-dangerous');

    await userEvent.click(ok);
    // Nút đang loading chặn pointer-events; fireEvent mô phỏng click lọt qua.
    fireEvent.click(ok);
    fireEvent.click(ok);
    expect(onConfirm).toHaveBeenCalledTimes(1);
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Huỷ' })).toBeDisabled(),
    );

    finish();
    // jsdom không bắn animationend nên popover dừng ở trạng thái đang đóng.
    await waitFor(() =>
      expect(document.querySelector('.ant-popover')?.className).toMatch(
        /leave|hidden/,
      ),
    );
  });
});
