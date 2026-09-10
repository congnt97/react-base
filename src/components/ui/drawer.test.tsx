import { render } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Drawer } from '@/components/ui/drawer';

const mask = () => document.querySelector('.ant-drawer-mask') as HTMLElement;

describe('Drawer', () => {
  it('đang gửi thì mask và ESC không đóng', async () => {
    const onClose = vi.fn();
    render(
      <Drawer open submitting title="Sửa" onClose={onClose}>
        nội dung
      </Drawer>,
    );

    await userEvent.click(mask());
    await userEvent.keyboard('{Escape}');

    expect(onClose).not.toHaveBeenCalled();
  });

  it('không gửi thì đóng được', async () => {
    const onClose = vi.fn();
    render(
      <Drawer open title="Sửa" onClose={onClose}>
        nội dung
      </Drawer>,
    );

    await userEvent.click(mask());

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
